import { useEffect, useState } from "react";
import { numberFormat, convertWeiToEther } from "../../utils/number";
import {
  auctionContract,
  bidContract,
  getStrTokenSymbol,
  getTokenSymbol,
  getWalletAccount,
  marketplaceContract,
  offerContract,
  tokenContract,
} from "../../utils/web3/init";
import Config from "../../utils/config";
import ButtonState from "../button/button-state";
import { unlimit } from "../../utils/global";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";
import { isTokenAllowance, SetApproveToken } from "../../utils/checkApprove";

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
    const amount = parseInt(state.market.data[1]._amount);

    if (value > amount) {
      data = amount;
    } else {
      data = value;
    }
    setAmount(data);
  };

  const checkAllowance = async () => {
    const account = await getWalletAccount();
    const _type = props.buyType === "buy-bid" ? "bid" : "offer";
    const allowance = await isTokenAllowance(
      Config.CLASS_TOKEN_ADDR,
      account,
      _type
    );

    if (BigInt(allowance) > 0) {
      setApprove(true);
    }
  };

  const setApproveToken = async () => {
    const account = await getWalletAccount();

    const _type = props.data.placement.state === "auction" ? "bid" : "offer";

    const status = await SetApproveToken(
      Config.CLASS_TOKEN_ADDR,
      account,
      _type,
      function (status) {
        setLoading(!status);
      }
    );
    if (status.status === true) {
      setApprove(true);
    }
  };

  const buyItemList = async () => {
    const account = await getWalletAccount();
    const { _marketId } = state.market.data[1];

    if (props.data.placement.state === "auction") {
      await bidContract.methods
        .buyAuction(parseInt(_marketId))
        .send({ from: account })
        .on("sending", function () {
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
              href={`${Config.BLOCK_EXPLORER}/tx/${receipt.transactionHash}`}
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
      // console.log(account, _marketId);
      await offerContract.methods
        .buyItem(parseInt(_marketId), parseInt(amount))
        .send({ from: account })
        .on("sending", function () {
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
              href={`${Config.BLOCK_EXPLORER}/tx/${receipt.transactionHash}`}
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
          props.data.placement.state == "auction"
            ? state.market.data[1]._terminatePrice
            : state.market.data[1]._price;

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
      <div className="area-modal">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
        <span className="hidden lg:inline-block lg:align-middle lg:h-screen">
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
            <div className="bg-modal-warpper max-w-3xl mx-auto p-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:p-8">
              <h2 className="modal-title">Complete Checkout</h2>
              <div className="lg:space-x-10 flex-col lg:flex-row">
                <div className="table-theme-warper">
                  <table className="table-theme">
                    <thead>
                      <tr>
                        <th>Item</th>

                        <th>
                          {props.data.placement.state === "market" && (
                            <p>Amount</p>
                          )}
                        </th>

                        <th className="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-left">
                          <div className="td-product-item">
                            <img
                              src={
                                state.market.detail &&
                                typeof state.market.detail !== "undefined" &&
                                typeof state.market.detail.metadata !==
                                  "undefined" &&
                                typeof state.market.detail.metadata
                                  .image_cdn !== "undefined"
                                  ? state.market.detail.metadata.image_cdn
                                  : "/assets/image/no-image.jpg"
                              }
                              className="w-16 h-16 object-center object-cover rounded mr-6"
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src =
                                  "/assets/image/no-image.jpg";
                              }}
                            />
                            <div className="td-product-item-desc">
                              <div className="font-small text-gray-900">
                                {state.market.detail &&
                                typeof state.market.detail !== "undefined" &&
                                typeof state.market.detail.metadata !==
                                  "undefined" &&
                                typeof state.market.detail.metadata
                                  .description !== "undefined"
                                  ? state.market.detail.metadata.description
                                  : "-"}
                              </div>
                              <div className="font-small text-gray-900">
                                {state.market.detail &&
                                typeof state.market.detail !== "undefined" &&
                                typeof state.market.detail.metadata !==
                                  "undefined" &&
                                typeof state.market.detail.metadata.name !==
                                  "undefined"
                                  ? state.market.detail.metadata.name
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td width={"80px"} className="text-center">
                          {props.data.placement.state === "market" && (
                            <input
                              type="number"
                              value={amount}
                              min={1}
                              onChange={(e) => handleAmount(e.target.value)}
                              className="form-control text-right input-amount"
                            />
                          )}
                        </td>

                        <td className="font-small text-gray-900  text-right">
                          {props.data.placement.state === "auction"
                            ? numberFormat(
                                convertWeiToEther(
                                  state.market.data[1]._terminatePrice
                                )
                              )
                            : numberFormat(
                                convertWeiToEther(state.market.data[1]._price)
                              )}{" "}
                          {getStrTokenSymbol()}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>
                        <td>Total</td>
                        <td className="font-total text-right">
                          {total} {getStrTokenSymbol()}
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
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  {approve ? (
                    <ButtonState
                      onFunction={() => buyItemList()}
                      text={"Buy Item"}
                      loading={loading}
                      classStyle={"btn btn-primary"}
                    />
                  ) : (
                    <ButtonState
                      onFunction={() => setApproveToken()}
                      text={"Approve"}
                      loading={loading}
                      classStyle={"btn btn-primary"}
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
