import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import BuyItemModal from "../../../../../components/modal/buy-item";
import BidItemModal from "../../../../../components/modal/bid-item";
import { Transition } from "@tailwindui/react";
import OfferItemModal from "../../../../../components/modal/offer-item";
import {
  auctionContract,
  bidContract,
  getMetadata,
  getStrTokenSymbol,
  getWalletAccount,
  landContract,
  marketplaceContract,
  mintContract,
  offerContract,
} from "../../../../../utils/web3/init";
import Config from "../../../../../utils/config";
import {
  convertWeiToEther,
  numberFormat,
  untilTime,
} from "../../../../../utils/number";
import ButtonState from "../../../../../components/button/button-state";
import Accordion from "../../../../../components/Accordion";
import {
  isTokenAllowance,
  SetApproveToken,
} from "../../../../../utils/checkApprove";
import { getWalletAddress } from "../../../../../utils/wallet/connector";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../../../../components/ToastDisplay";
import { mapZoneByAddress, smLandFn } from "../../../../../utils/web3/land";

const PlacementPage = () => {
  const router = useRouter();
  const { item, token, amount, owner } = router.query;

  const [pageLoading, setPageLoading] = useState(true);
  const [itemModal, setItemModal] = useState({});
  const [loadingState, setLoadingState] = useState({
    index: "",
    status: false,
  });
  const [account, setAccount] = useState(false);
  // const [currentAccount, setCurrentAccount] = useState(null);
  const [isAllowance, setIsAllowance] = useState({});
  const [isTokenDeposit, setIsTokenDeposit] = useState(false);
  const [marketDetail, setMarketDetail] = useState({});
  const [offerHistory, setOfferHistory] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [isWinnerAuction, setIsWinnerAuction] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingData, setBuildingData] = useState({});
  const [bundleURL, setBundleURL] = useState(null);
  const getPlacementMarket = async () => {
    const marketId = await marketplaceContract.methods
      .getMarketId(item, owner, token, amount, true)
      .call();

    const auctionId = await auctionContract.methods
      .getMarketId(item, owner, token, amount, true)
      .call();

    let object;
    let state;
    if (marketId[0] === true) {
      object = marketId;
      state = "market";
    } else if (auctionId[0] === true) {
      object = auctionId;
      state = "auction";
    }

    return { state, id: object };
  };

  const getMarketDetail = async (market) => {
    const { id, state } = market;

    let data;
    if (state === "market") {
      data = await marketplaceContract.methods
        ._getItemInfo(parseInt(id[1]))
        .call();
    } else if (state === "auction") {
      data = await auctionContract.methods._getItemInfo(parseInt(id[1])).call();
    }

    const detail = await fetchPlacementItem(
      data?.[1]?._item,
      data?.[1]?._itemType,
      data?.[1]?._tokenId,
      data?.[1]?._amount,
      data?.[1]
    );

    return { detail, data };
  };

  const fetchPlacementItem = async (address, type, tokenId, amount, item) => {
    let data;
    let contract;

    if (address.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()) {
      contract = mintContract;
    } else {
      contract = smLandFn(address);
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
  };

  const checkAllowanceToken = async (state) => {
    // const account = await getWalletAccount();
    if (!account) return 0;
    const result = await isTokenAllowance(
      Config.CLASS_TOKEN_ADDR,
      account,
      state
    );
    return result;
  };

  const closeOfferList = async (offerId, markerId, index) => {
    // const account = await getWalletAccount();

    const { status } = await offerContract.methods
      .closeOffer(offerId, markerId)
      .send({ from: account })
      .on("sending", function () {
        setLoadingState({
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
        setLoadingState({
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
        setLoadingState({
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
  };

  const fetchBidHistoryList = async (auctionId) => {
    const bidHistory = await bidContract.methods.getAllBids(auctionId).call();

    let arrBid = [];
    for (let i = bidHistory.length - 1; i >= 0; i--) {
      let bidData = await bidContract.methods
        .getSpecificBid(auctionId, i)
        .call();
      arrBid.push(bidData);
    }

    return arrBid;
  };

  const approveAuctionToken = async (type) => {
    let _type;
    if (type === "deposit") {
      _type = "bid";
    }
    if (!account) {
      toast(
        <ToastDisplay
          type={"error"}
          title={"Connect metamask"}
          description={"connect your metamask first"}
        />
      );
      return;
    }
    // const account = await getWalletAccount();
    const status = await SetApproveToken(
      Config.CLASS_TOKEN_ADDR,
      account,
      _type,
      function (status) {
        setLoadingState({
          index: type,
          status: !status,
        });
      }
    );

    if (status.status === true) {
      setIsAllowance({
        state: type,
        allowance: true,
      });
    }
  };

  const fetchPlacementMarket = async () => {
    // const account = await getWalletAccount();
    const placement = await getPlacementMarket();
    const market = await getMarketDetail(placement);
    const itemAddress = market.detail.item._item;
    const tokenId = market.detail.item._tokenId;
    // console.log("itemAddress : ", itemAddress, ", TokenID : ", market.detail.item._tokenId);
    if ((itemAddress = Config.GENNFT_ADDR)) {
      let url = `https://collection.velaverse.io/api/v1/assets/${itemAddress}/${tokenId}`;
      let dataBuilding = await fetch(url);
      let res = await dataBuilding.json();
      let finalBuildingData = res.length > 0 ? res[0] : {};
      setBuildingData(finalBuildingData);
      setIsBuilding(true);
    }
    // setCurrentAccount(account);
    setBundleURL(
      Config.BUNDLE_URI + market.detail.metadata?.attributes?.asset_model
    );

    const _mapZone = mapZoneByAddress(market.detail.item._item);

    market.detail.mapImage = _mapZone.image;
    // console.log("market", market);
    // console.log("placement", placement);

    setMarketDetail({
      market,
      placement,
    });

    if (placement.state === "market") {
      const allowance = await checkAllowanceToken("market");

      if (BigInt(allowance) > 0) {
        setIsAllowance({
          state: "market",
          allowance: true,
        });
      } else {
        setIsAllowance({
          state: "market",
          allowance: false,
        });
      }
    } else if (placement.state === "auction") {
      const allowanceDeposit = await checkAllowanceToken("bid");

      if (BigInt(allowanceDeposit) > 0) {
        setIsAllowance({
          state: "deposit",
          allowance: true,
        });
      } else {
        setIsAllowance({
          state: "deposit",
          allowance: false,
        });
      }

      const isDeposit = await bidContract.methods
        .getRefundData(parseInt(market.data[1]._marketId), account)
        .call();

      const checkDeposit =
        isDeposit.isBid === false && isDeposit.isRefund === false;
      setIsTokenDeposit(checkDeposit);

      const bidList = await fetchBidHistoryList(market.data[1]._marketId);

      const _bidList = await bidList.filter(
        (item) =>
          item._active === true &&
          item._cancel === false &&
          item._isAccept === false
      );
      setBidHistory(_bidList);

      const isWinner = await fetchWinnerAuctionList(
        market.data[1]._marketId,
        _bidList
      );

      setIsWinnerAuction(isWinner);
    }

    setPageLoading(false);
  };

  const fetchWinnerAuctionList = async (marketId, bidList) => {
    const _winner = await bidContract.methods
      ._getBidWinner(parseInt(marketId))
      .call();

    if (
      _winner[0]._buyer === (await getWalletAccount()) &&
      bidList.length > 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const fetchOfferHistoryList = async () => {
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

    return filterOffer;
  };

  const cancelPlaceAuction = async (index) => {
    const marketId = parseInt(marketDetail.market.data[1]._marketId);

    const account = await getWalletAccount();

    await auctionContract.methods
      .cancelAuction(marketId)
      .send({ from: account })
      .on("sending", function () {
        setLoadingState({
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
        setLoadingState({
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
      .on("error", function () {
        setLoadingState({
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
    const account = await getWalletAccount();
    const marketId = parseInt(marketDetail.market.data[1]._marketId);
    await auctionContract.methods
      .closeBid(marketId)
      .send({ from: account })
      .on("sending", function () {
        setLoadingState({
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
        setLoadingState({
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
      .on("error", function () {
        setLoadingState({
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

  const depositBid = async (name) => {
    let marketId = parseInt(marketDetail.market.data[1]._marketId);

    await bidContract.methods
      .depositCash(marketId)
      .send({ from: await getWalletAccount() })
      .on("sending", function () {
        setLoadingState({
          index: name,
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
        setLoadingState({
          index: name,
          status: false,
        });

        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Deposit Auction Success !!!"}
          />
        );

        location.reload();
      })
      .on("error", function () {
        setLoadingState({
          index: name,
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

  const cancelBidList = async (bid, index) => {
    const account = await getWalletAccount();
    let marketId = parseInt(marketDetail.market.data[1]._marketId);

    await bidContract.methods
      .cancelBid(marketId, bid)
      .send({ from: account })
      .on("sending", function () {
        setLoadingState({
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
        setLoadingState({
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
      .on("error", function () {
        setLoadingState({
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
    window.location.reload();
  };

  const acceptAuction = async (index) => {
    const account = await getWalletAccount();
    let marketId = parseInt(marketDetail.market.data[1]._marketId);
    await bidContract.methods
      .winnerAcceptBid(marketId)
      .send({ from: account })
      .on("sending", function () {
        setLoadingState({
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
        setLoadingState({
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
      .on("error", function () {
        setLoadingState({
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

  const fetchOfferList = useCallback(() => {
    const fetchingData = async () => {
      const current = await fetchOfferHistoryList();
      setOfferHistory(current);
    };

    fetchingData();
  }, [router]);
  const fetchingAccount = async () => {
    const wallet = await getWalletAccount();
    setAccount(wallet ? wallet : false);
  };
  useEffect(() => {
    if (!router.isReady) return;
    fetchPlacementMarket();
    fetchOfferList();
    fetchingAccount();
  }, [router.isReady, fetchOfferList, isWinnerAuction]);

  useEffect(() => {}, [itemModal, isTokenDeposit, bidHistory]);

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
                      typeof marketDetail.market.detail.mapImage !== "undefined"
                        ? marketDetail.market.detail.mapImage
                        : "/assets/image/no-image.jpg"
                    }
                  />
                  {/* <img
                    src={
                      typeof marketDetail.market.detail.metadata !==
                        "undefined" &&
                      typeof marketDetail.market.detail.metadata.image_cdn !==
                        "undefined"
                        ? marketDetail.market.detail.metadata.image_cdn
                        : "/assets/image/no-image.jpg"
                    }
                  /> */}
                </div>
              </div>
              <div className="col-span-2 lg:col-span-4">
                <div className="product-header">
                  <h2>
                    {typeof marketDetail.market.detail.metadata !==
                      "undefined" &&
                    typeof typeof marketDetail.market.detail.metadata.name !==
                      "undefined"
                      ? marketDetail.market.detail.metadata.name
                      : "-"}
                  </h2>
                  <p className="owner-id">
                    Owner Wallet :
                    <span>{marketDetail.market.data[1]._owner}</span>
                  </p>
                </div>
                <div className="product-desc">
                  {marketDetail.state !== "" && (
                    <>
                      <div className="desc-head">
                        <p className="text-center lg:text-left">
                          Sale ends
                          <span className="ml-2">
                            <time dateTime="2021-01-22">
                              {untilTime(
                                marketDetail.market.data[1]._expiration
                              )}
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
                            let statusAuction =
                              marketDetail.market.data[1]._status;
                            if (statusAuction && statusAuction != "0") {
                              return;
                            }
                            var now = new Date().getTime();
                            // Find the distance between now and the count down date
                            var distance =
                              marketDetail.market.data[1]._expiration * 1000 -
                              now;

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
                              const interval_id = window.setInterval(
                                function () {},
                                Number.MAX_SAFE_INTEGER
                              );

                              // Clear any timeout/interval up to that id
                              for (let i = 1; i < interval_id; i++) {
                                window.clearInterval(i);
                              }

                              document.querySelector(
                                ".time-countdown"
                              ).innerHTML = "EXPIRED";
                            }
                          }, 1000)}
                        </div>
                      </div>

                      <div className="desc-price">
                        <p>Current price</p>
                        <div className="price">
                          <span className="tooltip">
                            {numberFormat(
                              convertWeiToEther(
                                marketDetail.market.data[1]._price
                              )
                            )}
                          </span>
                          <span className="symbol-text">
                            {getStrTokenSymbol()}
                          </span>
                        </div>
                        <div className="action">
                          {marketDetail.market.data[1]._owner !== account &&
                          marketDetail.state !== "" ? (
                            <div className="mt-4 flex flex-wrap">
                              {Config.OPEN_PROCESS &&
                              marketDetail.placement.state === "market" ? (
                                <>
                                  {isAllowance.state === "market" &&
                                  isAllowance.allowance === false ? (
                                    <div>
                                      <ButtonState
                                        onFunction={() =>
                                          approveAuctionToken("buy")
                                        }
                                        text={"APPROVE TOKEN"}
                                        loading={
                                          loadingState.index === "buy" &&
                                          loadingState.status
                                        }
                                        classStyle={
                                          "btn btn-lg btn-primary mr-2"
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <div>
                                        <button
                                          onClick={() =>
                                            setItemModal({
                                              index: "buy",
                                              status: true,
                                            })
                                          }
                                          className="btn btn-lg btn-primary mr-2"
                                        >
                                          <i className="fas fa-wallet mr-2"></i>
                                          BUY NOW{" "}
                                          {numberFormat(
                                            convertWeiToEther(
                                              marketDetail.market.data[1]._price
                                            )
                                          )}{" "}
                                          {getStrTokenSymbol()}
                                        </button>
                                      </div>
                                      <div>
                                        <button
                                          className="btn btn-lg btn-primary mr-2"
                                          onClick={() =>
                                            setItemModal({
                                              index: "offer",
                                              status: true,
                                            })
                                          }
                                        >
                                          <i className="fas fa-tag mr-2"></i>
                                          MAKE OFFER
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {isAllowance.state === "deposit" &&
                                  isAllowance.allowance === false ? (
                                    <div>
                                      <ButtonState
                                        onFunction={() =>
                                          approveAuctionToken("deposit")
                                        }
                                        text={"APPROVE DEPOSIT"}
                                        loading={
                                          loadingState.index === "deposit" &&
                                          loadingState.status === true
                                        }
                                        classStyle={
                                          "btn btn-lg btn-primary mr-2"
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      {isTokenDeposit ? (
                                        <div>
                                          <ButtonState
                                            onFunction={() =>
                                              depositBid("deposit-bid")
                                            }
                                            text={"Deposit for Bid"}
                                            loading={
                                              loadingState.index ===
                                                "deposit-bid" &&
                                              loadingState.status === true
                                            }
                                            classStyle={
                                              "btn btn-lg btn-primary mr-2"
                                            }
                                          />
                                        </div>
                                      ) : (
                                        marketDetail.market.data[1]._status ===
                                          "0" && (
                                          <div>
                                            <button
                                              onClick={() =>
                                                setItemModal({
                                                  index: "bid",
                                                  status: true,
                                                })
                                              }
                                              type="button"
                                              className="btn btn-lg btn-primary mr-2"
                                            >
                                              <i className="far fa-hand-paper mr-2"></i>
                                              BID
                                            </button>
                                          </div>
                                        )
                                      )}
                                    </>
                                  )}

                                  {isWinnerAuction &&
                                    marketDetail.market.data[1]._status ===
                                      "1" && (
                                      <div>
                                        <ButtonState
                                          onFunction={() =>
                                            acceptAuction("accept-winner")
                                          }
                                          text={"ACCEPT WINNER"}
                                          classStyle={
                                            "btn btn-lg btn-primary mr-2"
                                          }
                                          loading={
                                            loadingState.index ===
                                              "accept-winner" &&
                                            loadingState.status === true
                                          }
                                        />
                                      </div>
                                    )}

                                  {BigInt(
                                    marketDetail.market.data[1]._terminatePrice
                                  ) > 0 &&
                                    marketDetail.market.data[1]._status ===
                                      "0" && (
                                      <div>
                                        <button
                                          onClick={() =>
                                            setItemModal({
                                              index: "buy",
                                              status: true,
                                            })
                                          }
                                          type="button"
                                          className="btn btn-lg btn-primary mr-2"
                                        >
                                          <i className="fas fa-wallet mr-2"></i>
                                          BUY NOW{" "}
                                          <span className="text-sm text-nowarp">
                                            {` ${numberFormat(
                                              convertWeiToEther(
                                                marketDetail.market.data[1]
                                                  ._terminatePrice
                                              )
                                            )} ${getStrTokenSymbol()}`}
                                          </span>
                                        </button>
                                      </div>
                                    )}
                                </>
                              )}
                            </div>
                          ) : (
                            <>
                              <div className="mt-4 flex flex-wrap">
                                {marketDetail.market.data[1]._owner ===
                                  account &&
                                  marketDetail.market.data[1]._status ===
                                    "0" && [
                                    <div>
                                      <ButtonState
                                        onFunction={() =>
                                          cancelPlaceAuction("cancel-auction")
                                        }
                                        text={"CANCEL AUCTION"}
                                        loading={
                                          loadingState.index ===
                                            "cancel-auction" &&
                                          loadingState.status === true
                                        }
                                        classStyle={
                                          "btn btn-lg btn-primary mr-2"
                                        }
                                      />
                                    </div>,
                                    bidHistory.length > 1 && (
                                      <div>
                                        <ButtonState
                                          onFunction={() =>
                                            closeBid("close-bid")
                                          }
                                          text={"CLOSE BID"}
                                          classStyle={
                                            "btn btn-lg btn-primary mr-2"
                                          }
                                          loading={
                                            loadingState.index ===
                                              "close-bid" &&
                                            loadingState.status === true
                                          }
                                        />
                                      </div>
                                    ),
                                  ]}
                              </div>
                            </>
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
                            {marketDetail.market.data[1]._item}
                          </li>
                          <li>
                            <span className="name">Status :</span>{" "}
                            {marketDetail.placement.state === ""
                              ? "NOT LISTING"
                              : marketDetail.market.data[1]._available
                              ? "AVAILABLE"
                              : "NOT AVAILABLE"}
                          </li>
                          <li>
                            <span className="name">Token ID :</span>{" "}
                            {marketDetail.market.data[1]._tokenId}
                          </li>
                          <li>
                            <span className="name">Qty : </span>
                            {marketDetail.market.data[1]._amount}
                          </li>
                          {isBuilding &&
                            typeof marketDetail.market.detail.metadata
                              ?.attributes?.size_x != "undefined" && (
                              <li>
                                <span className="name">Building size : </span>
                                {marketDetail.market.detail.metadata?.attributes
                                  .size_x +
                                  " x " +
                                  marketDetail.market.detail.metadata
                                    ?.attributes.size_x}
                              </li>
                            )}
                          {isBuilding && !bundleURL.includes("undefined") && (
                            <li>
                              <span className="name">Bundle URL : </span>
                              {bundleURL}
                              <i
                                className="fa fa-solid fa-copy ml-1"
                                onClick={() => {
                                  navigator.clipboard.writeText(bundleURL);
                                  toast(
                                    <ToastDisplay
                                      type={"success"}
                                      title={"Bundle URI"}
                                      description={"Copy Bundle URI Success"}
                                    />
                                  );
                                }}
                              ></i>
                            </li>
                          )}
                          {isBuilding && buildingData.verify === "Y" && (
                            <li>
                              <span className="name">VERIFIED </span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    {marketDetail.placement.state === "auction" ? (
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
                              {bidHistory.length > 0 ? (
                                bidHistory.map((item, index) => {
                                  return item._active ? (
                                    <tr key={index}>
                                      <td>
                                        {numberFormat(
                                          convertWeiToEther(item._price)
                                        )}
                                      </td>
                                      <td>{getWalletAddress(item._buyer)}</td>
                                      <td>
                                        {index === 0 &&
                                          marketDetail.market.data[1]
                                            ._status === "0" &&
                                          isWinnerAuction && (
                                            <ButtonState
                                              onFunction={() =>
                                                cancelBidList(item.bidId, index)
                                              }
                                              text={"CANCEL BID"}
                                              loading={
                                                loadingState.index === index &&
                                                loadingState.status === true
                                              }
                                              classStyle={
                                                "btn btn-primary btn-sm mt-0"
                                              }
                                            />
                                          )}
                                      </td>
                                    </tr>
                                  ) : (
                                    <></>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    colSpan={"4"}
                                    style={{ textAlign: "center" }}
                                  >
                                    No Bid List
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
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
                                              loadingState.index === index &&
                                              loadingState.status
                                            }
                                            text={"CANCEL OFFER"}
                                            classStyle={
                                              "btn btn-primary btn-sm mt-0"
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
        show={itemModal.index === "buy" && itemModal.status}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <BuyItemModal
          show={itemModal.index === "buy" && itemModal.status}
          onClose={() =>
            setItemModal({
              index: "buy",
              status: false,
            })
          }
          data={marketDetail}
        />
      </Transition>
      <Transition
        show={itemModal.index === "bid" && itemModal.status}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <BidItemModal
          show={itemModal.index === "bid" && itemModal.status}
          onClose={() =>
            setItemModal({
              index: "bid",
              status: false,
            })
          }
          data={bidHistory}
          item={marketDetail}
        />
      </Transition>
      <Transition
        show={itemModal.index === "offer" && itemModal.status}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <OfferItemModal
          show={itemModal.index === "offer" && itemModal.status}
          onClose={() =>
            setItemModal({
              index: "offer",
              status: false,
            })
          }
          data={marketDetail}
        />
      </Transition>
    </>
  );
};

export default PlacementPage;
