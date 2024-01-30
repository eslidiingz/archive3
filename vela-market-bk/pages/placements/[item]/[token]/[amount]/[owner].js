import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  convertWeiToEther,
  numberFormat,
  untilTime,
} from "../../../../../utils/number";
import {
  auctionContract,
  avatarContract,
  getMetadata,
  getTokenSymbol,
  getWalletAccount,
  itemContract,
  marketplaceContract,
  tokenContract,
} from "../../../../../utils/web3/init";
import Config from "../../../../../utils/config.json";
import BuyItemModal from "../../../../../components/modal/buy-item";
import BidItemModal from "../../../../../components/modal/bid-item";
import { Transition } from "@tailwindui/react";
import OfferItemModal from "../../../../../components/modal/offer-item";
import ButtonState from "../../../../../components/button/button-state";
import { toast } from "react-toastify";

import { ToastDisplay } from "../../../../../components/ToastDisplay";
import { unlimit } from "../../../../../utils/global";

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

  const fetchOfferHistoryList = async () => {
    const { owner, amount, item, token } = router.query;

    const marketId = await marketplaceContract.methods
      .getMarketId(item, owner, token, amount, true)
      .call();

    const offerList = await marketplaceContract.methods
      .getOfferLists(owner)
      .call();

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
    // if (offerHistory.length === 0) {
    //   setOfferHistory(filterOffer);
    // }
  };

  const closeOfferList = async (offerId, markerId, index) => {
    const { owner } = router.query;
    const account = await getWalletAccount();

    const { status } = await marketplaceContract.methods
      .closeOffer(owner, offerId, markerId)
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
            description={"Close Offer Success !!!"}
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
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      });

    if (status) {
      fetchOfferList();
    }
  };

  const fetchPlacementDetail = async () => {
    const marketId = await marketplaceContract.methods
      .getMarketId(item, owner, token, amount, true)
      .call();

    const auctionId = await auctionContract.methods
      .getMarketId(item, owner, token, amount, true)
      .call();

    if (market === null) {
      if (marketId[0] === true) {
        setMarket({ state: "market", id: marketId[1] });
      } else if (auctionId[0] === true) {
        setMarket({ state: "auction", id: auctionId[1] });
      }
    }

    if (market !== null) {
      let data = await fetchMarketDetail();
      await getBidHistory(parseInt(auctionId[1]), data);
    }

    setTokenSymbol(await getTokenSymbol());
  };
  const getBidHistory = async (auctionId, data) => {
    const bidHistory = await auctionContract.methods
      .getAllBids(auctionId)
      .call();

    let newArr = [];
    for (let i = bidHistory.length - 1; i >= 0; i--) {
      let bidData = await auctionContract.methods
        .getSpecificBid(auctionId, i)
        .call();
      newArr.push(bidData);
    }

    let winner = newArr[0]["_buyer"];
    const account = await getWalletAccount();
    console.log(data[1]);
    if (
      data[1]["_available"] === false ||
      data[1]["_owner"] !== account ||
      data[1]["_status"] == "0"
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
  };
  const fetchPlacementItem = async (type, tokenId, amount, item) => {
    let data;

    if (type === "1") {
      const _collection = await itemContract.methods.getBaseUrl().call();
      const metadata = await getMetadata(`${_collection}/${tokenId}.json`);
      data = {
        amount,
        metadata,
        item,
        type: "ERC1155",
      };
    } else if (type === "2") {
      const _collection = await avatarContract.methods.tokenURI(tokenId).call();
      const metadata = await getMetadata(`${_collection}`);
      data = {
        amount,
        metadata,
        item,
        type: "ERC721",
      };
    }

    return data;
  };

  const checkAllowance = async () => {
    const account = await getWalletAccount();

    const { state } = detail;

    if (state === "market") {
      const allowance = await tokenContract.methods
        .allowance(account, Config.MarketPlaceAddress)
        .call();

      if (allowance <= 0) {
        setApprove(false);
      } else {
        setApprove(true);
      }
    } else if (state === "auction") {
      const allowance = await tokenContract.methods
        .allowance(account, Config.MarketAuctionAddress)
        .call();

      if (allowance <= 0) {
        setApprove(false);
      } else {
        setApprove(true);
      }
    }
  };

  const fetchMarketDetail = async () => {
    const { id, state } = market;
    let data;

    if (state === "market") {
      data = await marketplaceContract.methods
        ._getItemInfo(parseInt(id))
        .call();
    } else if (state === "auction") {
      data = await auctionContract.methods._getItemInfo(parseInt(id)).call();
    }

    const placement = await fetchPlacementItem(
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
    return data;
  };

  const approveAuctionToken = async (index) => {
    const account = await getWalletAccount();
    await tokenContract.methods
      .approve(Config.MarketAuctionAddress, unlimit)
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
        setApprove(true);

        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Approve Success !!!"}
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
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      });
  };

  const cancelPlaceAuction = async (index) => {
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
  };

  const closeBid = async (index) => {
    const account = await getWalletAccount();
    let marketId = parseInt(market.id);
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
  };

  const acceptAuction = async (index) => {
    const account = await getWalletAccount();
    let marketId = parseInt(market.id);
    await auctionContract.methods
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

  useEffect(async () => {
    if (!router.isReady) return;
    await fetchPlacementDetail();
    await getAccount();
    await fetchOfferList();
  }, [router.isReady, market, detail, fetchOfferList]);

  if (!detail) {
    return null;
  }
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-x-8 items-start">
            <div className="flex flex-col-reverse">
              <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <div className="grid grid-cols-2 gap-6">
                  {Config.openProcess &&
                    detail.state === "market" && [
                      owner !== account && (
                        <>
                          <div>
                            <button
                              onClick={() => showModalBuyItem()}
                              className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                            >
                              BUY
                            </button>
                          </div>
                          <div>
                            <button
                              className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                              onClick={() => showModalOfferItem()}
                            >
                              MAKE OFFER
                            </button>
                          </div>
                        </>
                      ),
                    ]}
                  {Config.openProcess &&
                    detail.state === "auction" && [
                      owner !== account &&
                        detail.placement.item.status === "0" && (
                          <button
                            onClick={() => showModalBidItem()}
                            type="button"
                            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                          >
                            BID
                          </button>
                        ),
                      owner !== account &&
                        parseInt(detail.placement.item._terminatePrice) > 0 && (
                          <button
                            onClick={() => showModalBuyItem("buy-bid")}
                            type="button"
                            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                          >
                            BUY{" "}
                            {` ${numberFormat(
                              convertWeiToEther(
                                detail.placement.item._terminatePrice
                              )
                            )} ${tokenSymbol}`}
                          </button>
                        ),
                      isActive && (
                        <>
                          {approve ? (
                            <>
                              <ButtonState
                                onFunction={() =>
                                  cancelPlaceAuction("CANCEL AUCTION")
                                }
                                text={"CANCEL AUCTION"}
                                loading={
                                  loading.index === "CANCEL AUCTION" &&
                                  loading.status
                                }
                                classStyle={
                                  "max-w-xs flex-1 bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-small text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                }
                              />
                              <ButtonState
                                disabled={bidHistory.length > 1}
                                onFunction={() => closeBid("CLOSE BID")}
                                text={"CLOSE BID"}
                                loading={
                                  loading.index === "CLOSE BID" &&
                                  loading.status
                                }
                                classStyle={
                                  "max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                }
                              />
                            </>
                          ) : (
                            <ButtonState
                              onFunction={() =>
                                approveAuctionToken("APPROVE AUCTION")
                              }
                              text={"APPROVE CANCEL & CLOSE BID"}
                              loading={
                                loading.index === "APPROVE AUCTION" &&
                                loading.status
                              }
                              classStyle={
                                "col-span-2 bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-red-500 sm:w-full"
                              }
                            />
                          )}
                        </>
                      ),
                    ]}
                </div>
              </div>
              <div className="w-full aspect-w-1 aspect-h-1">
                <img
                  src={detail.placement.metadata.image}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                />
              </div>
            </div>

            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 col-span-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {detail.placement.metadata.name}
              </h1>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div className="text-base text-gray-700 space-y-6">
                  <p>{detail.placement.metadata.description}</p>
                </div>

                <div className="mt-10">
                  <div className="bg-gray-50 px-4 py-6 rounded-lg items-center justify-between space-x-8">
                    <dl className="divide-y divide-gray-200 space-y-4 text-sm text-gray-600 flex-auto md:divide-y-0 md:space-y-0 grid grid-cols-3 md:gap-x-6">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">
                          Current price
                        </dt>
                        <dd className="md:mt-1">
                          {numberFormat(
                            convertWeiToEther(detail.placement.item._price)
                          )}{" "}
                          EPIC
                        </dd>
                      </div>
                      <div className="flex justify-between pt-4 md:block md:pt-0">
                        <dt className="font-medium text-gray-900">Sale ends</dt>
                        <dd className="md:mt-1">
                          <time dateTime="2021-01-22">
                            {untilTime(detail.placement.item._expiration)}
                          </time>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              {Config.openProcess && isWinner && (
                <>
                  {approve ? (
                    <ButtonState
                      onFunction={() => acceptAuction("ACCEPT WINNER")}
                      text={"ACCEPT WINNER"}
                      loading={
                        loading.index === "ACCEPT WINNER" && loading.status
                      }
                      classStyle={
                        "py-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      }
                    />
                  ) : (
                    <ButtonState
                      onFunction={() => approveAuctionToken("APPROVE WINNER")}
                      text={"APPROVE WINNER"}
                      loading={
                        loading.index === "APPROVE WINNER" && loading.status
                      }
                      classStyle={
                        "py-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      }
                    />
                  )}
                </>
              )}
              <section className="mt-8">
                <div className="border-t divide-y divide-gray-200">
                  <div>
                    <h3>
                      <button
                        type="button"
                        className="group relative w-full py-6 flex justify-between items-center text-left"
                        aria-controls="disclosure-1"
                        aria-expanded="false"
                      >
                        <span className="text-gray-900 text-xl font-medium">
                          Details
                        </span>
                        <span className="ml-6 flex items-center">
                          <svg
                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <svg
                            className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18 12H6"
                            />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div className="pb-6 prose prose-sm">
                      <ul role="list">
                        <li>
                          Contract Address : {detail.placement.item._item}
                        </li>
                        <li>
                          Status :{" "}
                          {detail.placement.item._available
                            ? "AVAILABLE"
                            : "NOT AVAILABLE"}
                        </li>
                        <li>Owner Address : {detail.placement.item._owner}</li>
                        <li>Token ID : {detail.placement.item._tokenId}</li>
                        <li>Token Standard : {detail.placement.type}</li>
                        <li>Amount : {detail.placement.amount}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {Config.openProcess &&
                detail.state === "auction" && [
                  bidHistory.length > 0 && (
                    <section className="mt-8">
                      <div className="border-t divide-y divide-gray-200">
                        <div>
                          <h3>
                            <button
                              type="button"
                              className="group relative w-full py-6 flex justify-between items-center text-left"
                              aria-controls="disclosure-1"
                              aria-expanded="false"
                            >
                              <span className="text-gray-900 text-xl font-medium">
                                Bid History
                              </span>
                              <span className="ml-6 flex items-center">
                                <svg
                                  className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                <svg
                                  className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18 12H6"
                                  />
                                </svg>
                              </span>
                            </button>
                          </h3>

                          <div>
                            <div className="py-2 align-middle ">
                              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Price (EPIC)
                                      </th>
                                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        From
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {bidHistory.map((item, index) => {
                                      return (
                                        <tr key={index}>
                                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-black">
                                            {numberFormat(
                                              convertWeiToEther(item._price)
                                            )}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                            {item._buyer}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  ),
                ]}

              {Config.openProcess && offerHistory.length > 0 && (
                <section className="mt-8">
                  <div className="border-t divide-y divide-gray-200">
                    <div>
                      <h3>
                        <button
                          type="button"
                          className="group relative w-full py-6 flex justify-between items-center text-left"
                          aria-controls="disclosure-1"
                          aria-expanded="false"
                        >
                          <span className="text-gray-900 text-xl font-medium">
                            Offer History
                          </span>
                          <span className="ml-6 flex items-center">
                            <svg
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <svg
                              className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M18 12H6"
                              />
                            </svg>
                          </span>
                        </button>
                      </h3>

                      <div>
                        <div className="py-2 align-middle ">
                          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                    Price (EPIC)
                                  </th>
                                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                    Expiration
                                  </th>
                                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                    From
                                  </th>
                                  <th className="relative px-6 py-3"></th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {offerHistory.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-black">
                                        {numberFormat(
                                          convertWeiToEther(item._price)
                                        )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                        {untilTime(item._expiration)}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                                        {item._buyer}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                                              "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
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
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <Transition
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
