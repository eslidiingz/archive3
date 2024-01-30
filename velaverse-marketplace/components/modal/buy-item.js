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
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="modal-global-size transform transition-all">
          <div className="hidden close-modal">
            <button
              type="button"
              onClick={() => onClose()}
              className="close-modal-text"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-8 w-8"
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
          <div className="bg-modal">
            <div className="bg-modal-warpper max-w-3xl mx-auto px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">

              <p className="text-2xl font-bold justify-center items-center">
                Complete Checkout
              </p>
              <div className="lg:space-x-4 flex-col lg:flex-row">
                <div>
                  <table className="table-theme mt-6">
                    <thead>
                      <tr>
                        <th>
                          Item
                        </th>
                        
                          <th>
                            {props.buyType === "buy" && (
                              <p>Amount</p>
                            )}
                          </th>
                        
                        <th className="text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
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
                        
                          <td>
                            {props.buyType === "buy" && (
                              <input
                                type="number"
                                value={amount}
                                min={1}
                                onChange={(e) => handleAmount(e.target.value)}
                                className="form-control text-right"
                              />
                            )}
                          </td>
                        
                        <td className="text-right">
                          {props.buyType === "buy-bid"
                            ? numberFormat(
                                convertWeiToEther(
                                  state.placement.item._terminatePrice
                                )
                              )
                            : numberFormat(
                                convertWeiToEther(state.placement.item._price)
                              )} EPIC
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>
                        <td>
                          Total
                        </td>
                        <td className="font-total text-right">
                          {total} EPIC
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-end">
                  <button
                    onClick={() => onClose()}
                    type="button"
                    className="btn-theme btn-secondary"
                  >
                    Cancel
                  </button>
                  {approve ? (
                    <ButtonState
                      onFunction={() => buyItemList()}
                      text={"Buy Item"}
                      loading={loading}
                      classStyle={
                        "btn-theme bg-sell mr-0"
                      }
                    />
                  ) : (
                    <ButtonState
                      onFunction={() => setApproveToken()}
                      text={"Approve"}
                      loading={loading}
                      classStyle={
                        "btn-theme btn-primary mr-0"
                      }
                    />
                  )}
                </div>
              </div>

            </div>
            
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default BuyItemModal;
