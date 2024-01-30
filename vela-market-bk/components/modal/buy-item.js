import { useEffect, useState } from "react";
import { numberFormat, convertWeiToEther } from "../../utils/number";
import {
  auctionContract,
  getWalletAccount,
  marketplaceContract,
  tokenContract,
} from "../../utils/web3/init";
import Config from "../../utils/config.json";
import ButtonState from "../button/button-state";
import { unlimit } from "../../utils/global";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";

const BuyItemModal = (props) => {
  const [state, setState] = useState(null);
  const [amount, setAmount] = useState(1);
  const [total, setTotal] = useState(0);
  const [approve, setApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };

  const fetchDetailData = () => {
    setState(props.data);
    console.log(props.data);
  };

  const handleAmount = (value) => {
    let data = 0;
    const amount = parseInt(state.placement.item._amount);

    if (value > amount) {
      data = amount;
    } else {
      data = value;
    }
    setAmount(data);
  };

  const checkAllowance = async () => {
    const account = await getWalletAccount();

    if (props.buyType === "buy-bid") {
      var allowance = await tokenContract.methods
        .allowance(account, Config.MarketAuctionAddress)
        .call();
    } else {
      var allowance = await tokenContract.methods
        .allowance(account, Config.MarketPlaceAddress)
        .call();
    }

    if (allowance <= 0) {
      setApprove(false);
    } else {
      setApprove(true);
    }
  };

  const setApproveToken = async () => {
    const account = await getWalletAccount();

    if (props.buyType === "buy-bid") {
      var approve = await tokenContract.methods
        .approve(Config.MarketAuctionAddress, unlimit)
        .send({ from: account })
        .on("sending", function (result) {
          setLoading(true);

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading(false);
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
          setLoading(false);

          toast(
            <ToastDisplay
              type={"error"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        });
    } else {
      var approve = await tokenContract.methods
        .approve(Config.MarketPlaceAddress, unlimit)
        .send({ from: account })
        .on("sending", function (result) {
          setLoading(true);

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading(false);
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
          setLoading(false);

          toast(
            <ToastDisplay
              type={"error"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        });
    }
  };

  const buyItemList = async () => {
    const account = await getWalletAccount();
    const { _marketId } = state.placement.item;

    if (props.buyType === "buy-bid") {
      let result = await auctionContract.methods
        .buyAuction(parseInt(_marketId))
        .send({ from: account })
        .on("sending", function (result) {
          setLoading(true);

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading(false);

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Create bit item success !!!"}
              href={`${Config.blockExplorer}/tx/${receipt.transactionHash}`}
            />
          );
        })
        .on("error", function (error) {
          setLoading(false);

          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction rejected"}
              description={error.message}
            />
          );
        });
    } else {
      let result = await marketplaceContract.methods
        .buyItem(parseInt(_marketId), parseInt(amount))
        .send({ from: account })
        .on("sending", function (result) {
          setLoading(true);

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading(false);

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Create bit item success !!!"}
              href={`${Config.blockExplorer}/tx/${receipt.transactionHash}`}
            />
          );
        })
        .on("error", function (error) {
          setLoading(false);

          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction rejected"}
              description={error.message}
            />
          );
        });
    }

    window.location = "/profile/mynft";
  };

  useEffect(() => {
    if (state === null) {
      checkAllowance();
      fetchDetailData();
    }

    if (amount !== "") {
      if (state) {
        let _price =
          props.buyType == "buy-bid"
            ? state.placement.item._terminatePrice
            : state.placement.item._price;

        let _priceEth = convertWeiToEther(_price);

        const total = _priceEth * parseInt(amount);
        setTotal(numberFormat(total));
      }
    }
  }, [state, amount]);

  if (!props.show) {
    return null;
  }

  if (!state) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-2/4 sm:p-4">
          <p className="text-2xl font-bold justify-center items-center">
            Complete Checkout
          </p>
          <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="rounded-md text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="lg:space-x-4 flex-col lg:flex-row">
            <main className="mx-10">
              <section className="mt-6">
                <div className="space-y-20">
                  <div>
                    <table className="mt-4 w-full text-gray-500 sm:mt-6">
                      <thead className="sr-only text-sm text-gray-500 text-left sm:not-sr-only">
                        <tr>
                          <th className="sm:w-2/5 lg:w-1/3 pr-8 py-3 font-extrabold">
                            Item
                          </th>
                          {props.buyType === "buy" && (
                            <th className="text-center hidden w-1/5 pr-8 py-3 font-extrabold sm:table-cell">
                              Amount
                            </th>
                          )}
                          <th className="text-right hidden w-1/5 pr-8 py-3 font-extrabold sm:table-cell">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border-b border-gray-300 divide-y divide-gray-200 text-sm sm:border-t">
                        <tr>
                          <td className="py-6 pr-8">
                            <div className="flex items-center">
                              <img
                                src={state.placement.metadata.image}
                                className="w-16 h-16 object-center object-cover rounded mr-6"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {state.placement.metadata.name}
                                </div>
                                <div className="mt-1">
                                  {state.placement.metadata.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          {props.buyType === "buy" && (
                            <td className="hidden py-6 pr-8 sm:table-cell text-right">
                              <input
                                type="number"
                                value={amount}
                                min={1}
                                onChange={(e) => handleAmount(e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </td>
                          )}
                          <td className="hidden py-6 pr-8 sm:table-cell text-right">
                            {props.buyType === "buy-bid"
                              ? numberFormat(
                                  convertWeiToEther(
                                    state.placement.item._terminatePrice
                                  )
                                )
                              : numberFormat(
                                  convertWeiToEther(state.placement.item._price)
                                )}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="font-medium text-black text-base py-4 pr-8">
                            Total
                          </td>
                          <td
                            colSpan={2}
                            className="font-medium text-black text-base hidden py-4 pr-8 sm:table-cell text-right"
                          >
                            {total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </section>
            </main>
          </div>
          <div className="mt-5">
            <div className="flex">
              <button
                onClick={() => onClose()}
                type="button"
                className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 mx-4 bg-gray-400 text-base font-medium text-white  sm:text-sm"
              >
                Cancel
              </button>
              {approve ? (
                <ButtonState
                  onFunction={() => buyItemList()}
                  text={"Buy Item"}
                  loading={loading}
                  classStyle={
                    "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  }
                />
              ) : (
                <ButtonState
                  onFunction={() => setApproveToken()}
                  text={"Approve"}
                  loading={loading}
                  classStyle={
                    "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyItemModal;
