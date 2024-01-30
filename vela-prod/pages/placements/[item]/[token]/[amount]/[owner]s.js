import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  convertWeiToEther,
  numberFormat,
  untilTime,
} from "../../../../../utils/number";
import {
  auctionContract,
  bidContract,
  getMetadata,
  getStrTokenSymbol,
  getTokenSymbol,
  getWalletAccount,
  marketplaceContract,
  tokenContract,
  offerContract,
  landContract,
  mintContract,
} from "../../../../../utils/web3/init";
import Config from "../../../../../utils/config";
import BuyItemModal from "../../../../../components/modal/buy-item";
import BidItemModal from "../../../../../components/modal/bid-item";
import { Transition } from "@tailwindui/react";
import OfferItemModal from "../../../../../components/modal/offer-item";
import ButtonState from "../../../../../components/button/button-state";
import { toast } from "react-toastify";

import { ToastDisplay } from "../../../../../components/ToastDisplay";
import { getWalletAddress } from "../../../../../utils/wallet/connector";

import Accordion from "/components/Accordion";
import {
  isTokenAllowance,
  SetApproveToken,
} from "../../../../../utils/checkApprove";

const PlacementPage = () => {
  const router = useRouter();
  const { item, token, amount, owner } = router.query;
  const [approve, setApprove] = useState(false);
  const [market, setMarket] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [detail, setDetail] = useState(null);
  const [buyItemModal, setBuyItemModal] = useState(false);
  const [bidItemModal, setBidItemModal] = useState(false);
  const [offerItemModal, setOfferItemModal] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [offerHistory, setOfferHistory] = useState([]);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [buyType, setBuyType] = useState("buy");
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState({});
  const [isActive, setActive] = useState(true);
  const [isRefundable, setIsRefundable] = useState(null);
  const [isDeposit, setIsDeposit] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [loadingState, setLoadingState] = useState({});
  const [isAllowance, setIsAllowance] = useState({});

  const fetchMarketDetail = async (marketData) => {
    try {
      const { id, state } = marketData;
      let data;

      if (state === "market") {
        data = await marketplaceContract.methods
          ._getItemInfo(parseInt(id[1]))
          .call();
      } else if (state === "auction") {
        data = await auctionContract.methods
          ._getItemInfo(parseInt(id[1]))
          .call();
      }

      if (typeof data === "undefined") {
        const placement = await fetchPlacementItem(item, token, amount);
        if (detail === null) {
          await setDetail({ state: "", placement });
        }
      } else {
        const placement = await fetchPlacementItem(
          data[1]._item,
          data[1]._itemType,
          data[1]._tokenId,
          data[1]._amount,
          data[1]
        );

        if (detail === null) {
          await setDetail({ state, placement });
        }

        if (detail !== null) {
          await checkAllowance();
        }
      }
      return data;
    } catch (error) {
      console.log("fetchMarketDetail", error);
    }
  };

  const fetchOfferHistoryList = async () => {
    try {
      const { owner, amount, item, token } = router.query;

      const marketId = await marketplaceContract.methods
        .getMarketId(item, owner, token, amount, true)
        .call();

      const offerList = await offerContract.methods.getOfferLists(owner).call();

      const filterOffer = await offerList.filter((item) => {
        return (
          item._active === true &&
          item._isAccept === false &&
          item._marketId === marketId[1]
        );
      });

      const account = await getWalletAccount();

      setAccount(account);
      return filterOffer;
    } catch (error) {
      console.log("fetchOfferHistoryList", error);
    }
  };

  const closeOfferList = async (offerId, markerId, index) => {
    try {
      const account = await getWalletAccount();

      const { status } = await offerContract.methods
        .closeOffer(offerId, markerId)
        .send({ from: account })
        .on("sending", function () {
          setLoading({
            index: index,
            status: true,
          });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function () {
          setLoading({
            index: index,
            status: false,
          });

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Close Offer Success !!!"}
            />
          );
        })
        .on("error", function () {
          setLoading({
            index: index,
            status: false,
          });

          toast(
            <ToastDisplay
              type={"error"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        });

      if (status) {
        fetchOfferList();
      }
    } catch (error) {
      console.log("closeOfferList", error);
    }
  };
  const fetchPlacementDetail = async () => {
    try {
      const marketId = await marketplaceContract.methods
        .getMarketId(item, owner, token, amount, true)
        .call();

      const auctionId = await auctionContract.methods
        .getMarketId(item, owner, token, amount, true)
        .call();
      let object;
      if (marketId[0] === true) {
        object = marketId;
      } else if (auctionId[0] === true) {
        object = auctionId;
      }

      if (object !== undefined) {
        let state;
        if (marketId[0] === true) {
          state = "market";
        } else if (auctionId[0] === true) {
          state = "auction";
        }

        let data = { state: state, id: object };

        if (market === null) {
          setMarket(data);
        }

        if (market !== null) {
          let _data = await fetchMarketDetail(data);

          if (typeof _data !== "undefined" && state === "auction") {
            await getBidHistory(parseInt(auctionId[1]), _data);

            const checkDeposit = await bidContract.methods
              .getRefundData(auctionId[1], await getWalletAccount())
              .call();

            // console.log(checkDeposit);
            const deposit =
              checkDeposit.isBid === false && checkDeposit.isRefund === false;
            setIsDeposit(deposit);
            // setIsRefundable((prevState) => ({
            //   ...prevState,
            //   isRefundable: checkDeposit,
            // }));
          }
        }

        setTokenSymbol(await getTokenSymbol());
      } else {
      }
    } catch (error) {
      console.log("fetchPlacementDetail", error);
    }
  };

  const fetchPlacementItem = async (address, type, tokenId, amount, item) => {
    try {
      let data;
      let contract;

      if (address.toLowerCase() === Config.LAND_ADDR.toLowerCase()) {
        contract = landContract;
      } else if (address.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()) {
        contract = mintContract;
      }

      if (type === "2") {
        const _data = await contract.methods.tokenURI(tokenId).call();
        const metadata = await getMetadata(_data);
        data = {
          amount,
          metadata,
          item,
          type: "ERC721",
        };
      }

      return data;
    } catch (e) {
      console.log("fetchPlacementItem", e);
    }
  };
  const checkAllowance = async () => {
    try {
      const account = await getWalletAccount();

      const { state } = detail;

      const allowance = await isTokenAllowance(
        Config.CLASS_TOKEN_ADDR,
        account,
        state
      );

      if (BigInt(allowance) > 0) {
        setApprove(true);
      }
    } catch (e) {
      console.log("checkAllowance", e);
    }
  };

  const checkDepositAllowance = async () => {
    try {
      const account = await getWalletAccount();

      const allowance = await isTokenAllowance(
        Config.CLASS_TOKEN_ADDR,
        account,
        "bid"
      );

      if (BigInt(allowance) > 0) {
        setIsAllowance({
          status: true,
          state: "deposit",
        });
      } else {
        setIsAllowance({
          status: false,
          state: "deposit",
        });
      }
    } catch (e) {
      console.log("checkAllowance", e);
    }
  };

  const checkMarketAllowance = async () => {
    try {
      const account = await getWalletAccount();

      const allowance = await isTokenAllowance(
        Config.CLASS_TOKEN_ADDR,
        account,
        "market"
      );

      if (BigInt(allowance) > 0) {
        setIsAllowance({
          status: true,
          state: "market",
        });
      } else {
        setIsAllowance({
          status: false,
          state: "market",
        });
      }
    } catch (e) {
      console.log("checkAllowance", e);
    }
  };

  const checkWinnerAllowance = async () => {
    try {
      const account = await getWalletAccount();

      const allowance = await isTokenAllowance(
        Config.CLASS_TOKEN_ADDR,
        account,
        "bid"
      );

      if (BigInt(allowance) > 0) {
        setIsAllowance({
          status: true,
          state: "token",
        });
      } else {
        setIsAllowance({
          status: false,
          state: "token",
        });
      }
    } catch (e) {
      console.log("checkAllowance", e);
    }
  };

  const approveAuctionToken = async (index, _state = "market") => {
    try {
      const account = await getWalletAccount();
      const _s = _state !== "market" ? "bid" : "market";
      // console.log(_s);

      const status = await SetApproveToken(
        Config.CLASS_TOKEN_ADDR,
        account,
        _s,
        function (status) {
          setLoadingState({
            index: index,
            status: !status,
          });
        }
      );

      if (status.status === true) {
        setIsAllowance({
          status: true,
          state: _state,
        });
      }
    } catch (error) {
      console.log("approveAuctionToken", error);
    }
  };
  const getBidHistory = async (auctionId, data) => {
    const bidHistory = await bidContract.methods.getAllBids(auctionId).call();

    let newArr = [];
    for (let i = bidHistory.length - 1; i >= 0; i--) {
      let bidData = await bidContract.methods
        .getSpecificBid(auctionId, i)
        .call();
      newArr.push(bidData);
    }

    if (newArr.length > 0) {
      let winner = newArr[0]["_buyer"];
      const account = await getWalletAccount();

      if (
        data[1]["_available"] === false ||
        data[1]["_owner"] !== account ||
        parseInt(data[1]["_status"]) > 0
      ) {
        setActive(false);
      }

      if (
        account === winner &&
        data[1]["_available"] === true &&
        data[1]["_acceptTime"] > 0 &&
        newArr[0]["_isAccept"] === false &&
        newArr[0]["_cancel"] === false &&
        newArr[0]["_active"] == true
      ) {
        setIsWinner(true);
      } else {
        setIsWinner(false);
      }

      setBidHistory(newArr);
    }
  };
  const checkIsReadyForRefund = async () => {
    try {
      const account = await getWalletAccount();

      const isBidData = await bidContract.methods
        .getRefundData(parseInt(market.id[1]), account)
        .call();

      const allBid = await bidContract.methods
        .getAllBids(parseInt(market.id[1]))
        .call();

      let winner;
      if (allBid.length > 0) {
        winner = await bidContract.methods
          ._getBidWinner(parseInt(market.id[1]))
          .call();
      }

      const isOwnerItem = detail.placement.item._owner == account;
      const bidStatus = isBidData.isBid && isBidData.isRefund == false;
      const winnerStatus =
        winner !== undefined
          ? winner._buyer == account && winner._isAccept
          : false;
      const auctionStatus =
        detail.placement.item._status != "0" ||
        detail.placement.item._expiration <
          Math.floor(new Date().getTime() / 1000);

      // console.log(isOwnerItem, bidStatus, winnerStatus, auctionStatus);

      // const status =
      //   isOwnerItem && bidStatus && winnerStatus && auctionStatus;
      return {
        isOwnerItem,
        bidStatus,
        winnerStatus,
        auctionStatus,
      };
    } catch (error) {
      console.log("checkIsReadyForRefund", error);
    }
  };

  const depositBid = async () => {
    let marketId = parseInt(market.id[1]);
    // console.log(marketId);

    await bidContract.methods
      .depositCash(marketId)
      .send({ from: await getWalletAccount() })
      .on("sending", function (result) {
        setLoading({
          status: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("receipt", function (receipt) {
        setLoading({
          status: false,
        });
        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Deposit Auction Success !!!"}
          />
        );
      })
      .on("error", function (error) {
        setLoading({
          status: false,
        });
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction failed"}
            description={"Transaction failed please try again"}
          />
        );
      });
  };
  const cancelPlaceAuction = async (index) => {
    try {
      let marketId = parseInt(market.id);

      const account = await getWalletAccount();

      await auctionContract.methods
        .cancelAuction(marketId)
        .send({ from: account })
        .on("sending", function (result) {
          setLoading({
            index: index,
            status: true,
          });
          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading({
            index: index,
            status: false,
          });
          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Cancel Auction Success !!!"}
            />
          );
        })
        .on("error", function (error) {
          setLoading({
            index: index,
            status: false,
          });
          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction failed"}
              description={"Transaction failed please try again"}
            />
          );
        });

      window.location = "/profile/mynft";
    } catch (error) {
      console.log("cancelPlaceAuction", error);
    }
  };
  const cancelBidList = async (bid, index) => {
    const account = await getWalletAccount();
    let marketId = parseInt(market.id[1]);
    // console.log(marketId);
    await bidContract.methods
      .cancelBid(marketId, bid)
      .send({ from: account })
      .on("sending", function (result) {
        setLoading({
          index: index,
          status: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("receipt", function (receipt) {
        setLoading({
          index: index,
          status: false,
        });
        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Cancel Auction Success !!!"}
          />
        );
      })
      .on("error", function (error) {
        setLoading({
          index: index,
          status: false,
        });
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction failed"}
            description={"Transaction failed please try again"}
          />
        );
      });
    window.location = "/profile/mynft";
  };
  const closeBid = async (index) => {
    try {
      const account = await getWalletAccount();
      let marketId = parseInt(market.id[1]);
      await auctionContract.methods
        .closeBid(marketId)
        .send({ from: account })
        .on("sending", function (result) {
          setLoading({
            index: index,
            status: true,
          });
          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading({
            index: index,
            status: false,
          });
          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Cancel Auction Success !!!"}
            />
          );
        })
        .on("error", function (error) {
          setLoading({
            index: index,
            status: false,
          });
          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction failed"}
              description={"Transaction failed please try again"}
            />
          );
        });
      window.location = "/profile/mynft";
    } catch (error) {
      console.log("closeBid", error);
    }
  };
  const acceptAuction = async (index) => {
    try {
      const account = await getWalletAccount();
      let marketId = parseInt(market.id[1]);
      // console.log(marketId);
      await bidContract.methods
        .winnerAcceptBid(marketId)
        .send({ from: account })
        .on("sending", function (result) {
          setLoading({
            index: index,
            status: true,
          });
          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading({
            index: index,
            status: false,
          });
          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Cancel Auction Success !!!"}
            />
          );
        })
        .on("error", function (error) {
          setLoading({
            index: index,
            status: false,
          });
          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction failed"}
              description={"Transaction failed please try again"}
            />
          );
        });
      window.location = "/profile/mynft";
    } catch (error) {
      console.log("acceptAuction", error);
    }
  };
  const showBuyItemModal = () => {
    setBuyItemModal(!buyItemModal);
  };
  const showModalBuyItem = (buyType = "buy") => {
    setBuyType(buyType);
    setBuyItemModal(true);
  };
  const showBidItemModal = () => {
    setBidItemModal(!bidItemModal);
  };
  const showModalBidItem = () => {
    setBidItemModal(true);
  };
  const showOfferItemModal = () => {
    setOfferItemModal(!offerItemModal);
    fetchOfferList();
  };
  const showModalOfferItem = () => {
    setOfferItemModal(true);
  };
  const getAccount = async () => {
    setAccount(await getWalletAccount());
  };

  const fetchOfferList = useCallback(() => {
    const fetchingData = async () => {
      const current = await fetchOfferHistoryList();
      setOfferHistory(current);
    };

    fetchingData();
  }, [router]);

  const fetchIsReadyForRefund = useCallback(() => {
    const fetchingData = async () => {
      const current = await checkIsReadyForRefund();

      if (current === undefined) {
        setIsRefundable(current);
      }
    };

    fetchingData();
  }, [router, market]);

  const checkDetailAllowance = async () => {
    if (detail.state === "market") {
      await checkMarketAllowance();
    } else if (detail.state === "auction") {
      await checkDepositAllowance();
      await checkWinnerAllowance();
    }
  };

  useEffect(async () => {
    setPageLoading(true);
    if (!router.isReady) return;
    await fetchPlacementDetail();
    await checkDetailAllowance();
    await getAccount();
    await fetchOfferList();
    setPageLoading(false);
  }, [router.isReady, market, detail, fetchOfferList, isDeposit]);

  if (!detail) {
    return null;
  }

  return (
    <>
      <section className="vela-fluid product-page">
        <div className="content">
          {pageLoading ? (
            <div className="loader-page" align="center">
              <svg
                className="animate-spin -ml-1 mr-3 h-16 w-16 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-10">
              <div className="col-span-2">
                <div className="product-img-cover">
                  <img
                    src={
                      detail.placement &&
                      typeof detail.placement.metadata !== "undefined" &&
                      typeof detail.placement.metadata.image_cdn !== "undefined"
                        ? detail.placement.metadata.image_cdn
                        : "/assets/image/no-image.jpg"
                    }
                    className="product-img"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/assets/image/no-image.jpg";
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-4">
                <div className="product-header">
                  {/* <p>VelaLand</p> */}
                  <h2>
                    {detail.placement &&
                    typeof detail.placement.metadata !== "undefined" &&
                    typeof detail.placement.metadata.name !== "undefined"
                      ? detail.placement.metadata.name
                      : "-"}
                  </h2>
                  <p className="owner-id">
                    Owner Wallet :
                    <span>
                      {detail.state === ""
                        ? detail.placement.item.owner_of
                        : detail.placement.item._owner}
                    </span>
                  </p>
                </div>
                <div className="product-desc">
                  {detail.state !== "" && (
                    <>
                      <div className="desc-head">
                        <p className="text-center lg:text-left">
                          Sale ends
                          <span className="ml-2">
                            <time dateTime="2021-01-22">
                              {untilTime(detail.placement.item._expiration)}
                            </time>
                          </span>
                        </p>
                        <div className="time-countdown">
                          <div className="timer">
                            <div className="timer-count" id="time-day">
                              0
                            </div>
                            <div className="timer-desc">Days</div>
                          </div>
                          <div className="timer">
                            <div className="timer-count" id="time-hour">
                              0
                            </div>
                            <div className="timer-desc">Hours</div>
                          </div>
                          <div className="timer">
                            <div className="timer-count" id="time-min">
                              0
                            </div>
                            <div className="timer-desc">Minutes</div>
                          </div>
                          <div className="timer">
                            <div className="timer-count" id="time-sec">
                              0
                            </div>
                            <div className="timer-desc">Seconds</div>
                          </div>
                        </div>
                        <div style={{ display: "none" }}>
                          {setInterval(function () {
                            let statusAuction = detail.placement.item._status;
                            if (statusAuction && statusAuction != "0") {
                              return;
                            }
                            var now = new Date().getTime();
                            // Find the distance between now and the count down date
                            var distance =
                              detail.placement.item._expiration * 1000 - now;

                            // Time calculations for days, hours, minutes and seconds
                            var days = Math.floor(
                              distance / (1000 * 60 * 60 * 24)
                            );
                            var hours = Math.floor(
                              (distance % (1000 * 60 * 60 * 24)) /
                                (1000 * 60 * 60)
                            );
                            var minutes = Math.floor(
                              (distance % (1000 * 60 * 60)) / (1000 * 60)
                            );
                            var seconds = Math.floor(
                              (distance % (1000 * 60)) / 1000
                            );
                            document.getElementById("time-day")
                              ? (document.getElementById("time-day").innerHTML =
                                  days)
                              : "";
                            document.getElementById("time-hour")
                              ? (document.getElementById(
                                  "time-hour"
                                ).innerHTML = hours)
                              : "";
                            document.getElementById("time-min")
                              ? (document.getElementById("time-min").innerHTML =
                                  minutes)
                              : "";
                            document.getElementById("time-sec")
                              ? (document.getElementById("time-sec").innerHTML =
                                  seconds)
                              : "";

                            if (distance < 0) {
                              clearInterval(x);
                              document.getElementById("demo").innerHTML =
                                "EXPIRED";
                            }
                          }, 1000)}
                        </div>
                      </div>

                      <div className="desc-price">
                        <p>Current price</p>
                        <div className="price">
                          <span className="tooltip">
                            {convertWeiToEther(detail.placement.item._price)}
                          </span>
                          <span className="symbol-text">
                            {getStrTokenSymbol()}
                          </span>
                        </div>

                        <div className="action">
                          {detail.state !== "" && (
                            <div className="mt-4 flex flex-wrap">
                              <p>{isAllowance.status}</p>
                              {Config.OPEN_PROCESS &&
                                detail.state === "market" &&
                                isAllowance.state === "token" &&
                                owner !== account && [
                                  isAllowance.status === true ? (
                                    <>
                                      <div>
                                        <button
                                          onClick={() => showModalBuyItem()}
                                          className="btn btn-lg btn-primary mr-2"
                                        >
                                          <i className="fas fa-wallet mr-2"></i>
                                          BUY NOW{" "}
                                          {convertWeiToEther(
                                            detail.placement.item._price
                                          ).toLocaleString()}{" "}
                                          {getStrTokenSymbol()}
                                        </button>
                                      </div>
                                      <div>
                                        <button
                                          className="btn btn-lg btn-primary mr-2"
                                          onClick={() => showModalOfferItem()}
                                        >
                                          <i className="fas fa-tag mr-2"></i>
                                          MAKE OFFER
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <ButtonState
                                      onFunction={() =>
                                        approveAuctionToken(
                                          "APPROVE TOKEN",
                                          "buy-token"
                                        )
                                      }
                                      text={"APPROVE TOKEN"}
                                      loading={
                                        loadingState.index ===
                                          "APPROVE TOKEN" && loadingState.status
                                      }
                                      classStyle={"btn-theme-long btn-primary"}
                                    />
                                  ),
                                ]}
                              {Config.OPEN_PROCESS &&
                                detail.state === "auction" && [
                                  detail.placement.item._owner !== account && [
                                    detail.placement.item._status === "0" && [
                                      isAllowance.state === "deposit" &&
                                      isAllowance.status === true ? (
                                        isDeposit ? (
                                          <ButtonState
                                            onFunction={() => depositBid()}
                                            text={"Deposit for Bid"}
                                            loading={loading.status}
                                            classStyle={
                                              "btn btn-lg btn-primary mr-2"
                                            }
                                          />
                                        ) : (
                                          <button
                                            onClick={() => showModalBidItem()}
                                            type="button"
                                            className="btn btn-lg btn-primary mr-2"
                                          >
                                            <i className="far fa-hand-paper mr-2"></i>
                                            BID
                                          </button>
                                        )
                                      ) : (
                                        <ButtonState
                                          onFunction={() =>
                                            approveAuctionToken(
                                              "APPROVE DEPOSIT",
                                              "deposit"
                                            )
                                          }
                                          text={"APPROVE DEPOSIT"}
                                          loading={
                                            loadingState.index ===
                                              "APPROVE DEPOSIT" &&
                                            loadingState.status
                                          }
                                          classStyle={
                                            "btn btn-lg btn-primary mr-2"
                                          }
                                        />
                                      ),
                                    ],
                                    parseInt(
                                      detail.placement.item._terminatePrice
                                    ) > 0 &&
                                      detail.placement.item._status === "0" && (
                                        <button
                                          onClick={() =>
                                            showModalBuyItem("buy-bid")
                                          }
                                          type="button"
                                          className="btn btn-lg btn-primary mr-2"
                                        >
                                          <i className="fas fa-wallet mr-2"></i>
                                          BUY NOW{" "}
                                          <span className="text-sm text-nowarp">
                                            {` ${numberFormat(
                                              convertWeiToEther(
                                                detail.placement.item
                                                  ._terminatePrice
                                              )
                                            )} ${tokenSymbol}`}
                                          </span>
                                        </button>
                                      ),
                                  ],
                                ]}
                              {Config.OPEN_PROCESS &&
                                detail.state === "auction" &&
                                isWinner &&
                                detail.placement.item._status == "1" &&
                                isAllowance.state === "token" && [
                                  isAllowance.status === true ? (
                                    <ButtonState
                                      onFunction={() =>
                                        acceptAuction("ACCEPT WINNER")
                                      }
                                      text={"ACCEPT WINNER"}
                                      loading={
                                        loading.index === "ACCEPT WINNER" &&
                                        loading.status
                                      }
                                      classStyle={"btn-theme-long btn-primary"}
                                    />
                                  ) : (
                                    <ButtonState
                                      onFunction={() =>
                                        approveAuctionToken(
                                          "APPROVE WINNER",
                                          "winner"
                                        )
                                      }
                                      text={"APPROVE WINNER"}
                                      loading={
                                        loadingState.index ===
                                          "APPROVE WINNER" &&
                                        loadingState.status
                                      }
                                      classStyle={"btn-theme-long btn-primary"}
                                    />
                                  ),
                                ]}
                              {Config.OPEN_PROCESS &&
                                detail.state === "auction" && [
                                  isActive && (
                                    <>
                                      {approve ? (
                                        <>
                                          <ButtonState
                                            onFunction={() =>
                                              cancelPlaceAuction(
                                                "CANCEL AUCTION"
                                              )
                                            }
                                            text={"CANCEL AUCTION"}
                                            loading={
                                              loading.index ===
                                                "CANCEL AUCTION" &&
                                              loading.status
                                            }
                                            classStyle={
                                              "btn btn-lg btn-primary mr-2"
                                            }
                                          />
                                          {bidHistory.length > 1 ? (
                                            <ButtonState
                                              disabled={bidHistory.length > 1}
                                              onFunction={() =>
                                                closeBid("CLOSE BID")
                                              }
                                              text={"CLOSE BID"}
                                              loading={
                                                loading.index === "CLOSE BID" &&
                                                loading.status
                                              }
                                              classStyle={
                                                "btn btn-lg btn-primary mr-2"
                                              }
                                            />
                                          ) : (
                                            <div></div>
                                          )}
                                        </>
                                      ) : (
                                        <ButtonState
                                          onFunction={() =>
                                            approveAuctionToken(
                                              "APPROVE AUCTION",
                                              "auction"
                                            )
                                          }
                                          text={"APPROVE CANCEL & CLOSE BID"}
                                          loading={
                                            loading.index ===
                                              "APPROVE AUCTION" &&
                                            loading.status
                                          }
                                          classStyle={
                                            "btn btn-lg btn-primary mr-2"
                                          }
                                        />
                                      )}
                                    </>
                                  ),
                                ]}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="product-accordion">
                  <Accordion allowMultipleOpen>
                    <div label="Detail" isOpen>
                      <div className="acc-detailtab">
                        <ul role="list">
                          <li>
                            <span className="name">Contract Address :</span>{" "}
                            {detail.state === ""
                              ? detail.placement.item.token_address
                              : detail.placement.item._item}
                          </li>
                          <li>
                            <span className="name">Status :</span>{" "}
                            {detail.state === ""
                              ? "NOT LISTING"
                              : detail.placement.item._available
                              ? "AVAILABLE"
                              : "NOT AVAILABLE"}
                          </li>
                          <li>
                            <span className="name"> Owner Address :</span>{" "}
                            {detail.state === ""
                              ? detail.placement.item.owner_of
                              : detail.placement.item._owner}
                          </li>
                          <li>
                            <span className="name">Token ID :</span>{" "}
                            {detail.state === ""
                              ? detail.placement.item.token_id
                              : detail.placement.item._tokenId}
                          </li>
                          <li>
                            <span className="name">Qty : </span>
                            {detail.placement.amount}
                          </li>
                        </ul>
                      </div>
                    </div>
                    {detail.state === "auction" ? (
                      <div label="Bid History" isOpen>
                        <div className="table-theme-warper">
                          <table className="table-theme">
                            <thead>
                              <tr>
                                <th>Price ({getStrTokenSymbol()})</th>
                                <th>From</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {bidHistory.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>
                                      {numberFormat(
                                        convertWeiToEther(item._price)
                                      )}
                                    </td>
                                    <td>{getWalletAddress(item._buyer)}</td>
                                    <td>
                                      {index === 0 &&
                                        !isWinner &&
                                        detail.placement.item._owner !==
                                          account &&
                                        item._buyer === account && (
                                          <ButtonState
                                            onFunction={() =>
                                              cancelBidList(item.bidId, index)
                                            }
                                            loading={
                                              loading.index === index &&
                                              loading.status
                                            }
                                            text={"CANCEL BID"}
                                            classStyle={
                                              "btn btn-primary btn-sm mt-0"
                                            }
                                          />
                                        )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : detail.state === "market" ? (
                      <div label="Offer History" isOpen>
                        <div className="table-theme-warper">
                          <table className="table-theme">
                            <thead>
                              <tr>
                                <th>Price ({getStrTokenSymbol()})</th>
                                <th>Expiration</th>
                                <th>From</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {offerHistory.length > 0 ? (
                                offerHistory.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {numberFormat(
                                          convertWeiToEther(item._price)
                                        )}
                                      </td>
                                      <td>{untilTime(item._expiration)}</td>
                                      <td>{getWalletAddress(item._buyer)}</td>
                                      <td>
                                        {item._buyer === account && (
                                          <ButtonState
                                            onFunction={() =>
                                              closeOfferList(
                                                item._offerId,
                                                item._marketId,
                                                index
                                              )
                                            }
                                            loading={
                                              loading.index === index &&
                                              loading.status
                                            }
                                            text={"CANCEL OFFER"}
                                            classStyle={
                                              "btn btn-primary btn-sm"
                                            }
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    colSpan={"4"}
                                    style={{ textAlign: "center" }}
                                  >
                                    No Offer List
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </Accordion>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Transition
        className="absolute"
        style={{ zIndex: "100" }}
        show={buyItemModal}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <BuyItemModal
          show={buyItemModal}
          onClose={showBuyItemModal}
          data={detail}
          buyType={buyType}
        />
      </Transition>
      <Transition
        show={bidItemModal}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <BidItemModal
          show={bidItemModal}
          onClose={showBidItemModal}
          data={bidHistory}
          item={detail}
        />
      </Transition>
      <Transition
        show={offerItemModal}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <OfferItemModal
          show={offerItemModal}
          onClose={showOfferItemModal}
          data={detail}
        />
      </Transition>
    </>
  );
};

export default PlacementPage;
