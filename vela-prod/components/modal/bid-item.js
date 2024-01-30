import { useState, useEffect } from "react";
import {
  untilTime,
  convertWeiToEther,
  convertEthToWei,
  numberFormat,
} from "../../utils/number";
import ButtonState from "../button/button-state";
import {
  bidContract,
  getStrTokenSymbol,
  getTokenSymbol,
  getWalletAccount,
  tokenContract,
  web3,
} from "../../utils/web3/init";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";
import { getWalletAddress } from "../../utils/wallet/connector";
import { isTokenAllowance, SetApproveToken } from "../../utils/checkApprove";
import Config from "../../utils/config";

const BidItemModal = (props) => {
  const [bidPrice, setBidPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };

  useEffect(() => {}, []);

  const bidItem = async () => {
    const latestPrice =
      props.data.length > 0 ? BigInt(props.data[0]["_price"]) : 0;

    let bidPrices = BigInt(convertEthToWei(bidPrice));

    if (bidPrices <= 0 || bidPrices <= latestPrice) {
      bidPrices = 0;

      toast(
        <ToastDisplay
          type={"error"}
          title={"Transaction Failed"}
          description={`Bid price must greater than current (${numberFormat(
            convertWeiToEther(latestPrice)
          )} ${getStrTokenSymbol()}) `}
        />
      );

      return;
    }
    const account = await getWalletAccount();
    let marketId = parseInt(props.item.placement.id[1]);
    // console.log(props);
    // console.log(marketId, convertWeiToEther(bidPrices));

    await bidContract.methods
      .bidItem(marketId, bidPrices)
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
      .on("receipt", function () {
        setLoading(false);

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
            title={"Error Transaction"}
            description={error.message}
          />
        );
      });
    location.reload();
  };

  if (!props.show) {
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
              <h2 className="modal-title">Bid Item</h2>
              <div className="table-theme-warper">
                <table className="table-theme table-scroll-end mt-6">
                  <thead>
                    <tr>
                      <th>Wallet Address</th>
                      <th>Price ({getStrTokenSymbol()})</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.data.map((x, index) => {
                      return (
                        <tr key={index}>
                          <td>{getWalletAddress(x["_buyer"])}</td>
                          <td>
                            {numberFormat(convertWeiToEther(x["_price"]))}
                          </td>
                          <td>
                            {x["_time"]
                              ? untilTime(x["_time"])
                              : untilTime(Date.now())}
                          </td>
                          <td>
                            {x["_cancel"] !== false && x["_active"] !== true
                              ? "CANCEL"
                              : "AVAILABLE"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end items-end mt-4">
                <div className="flex">
                  <label className="label-modal">Bid Price</label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={bidPrice}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      } else {
                        setBidPrice(e.target.value);
                      }
                    }}
                    className="form-control"
                  />
                </div>
                <div>
                  <ButtonState
                    onFunction={() => bidItem()}
                    text={"BID"}
                    loading={loading}
                    classStyle={"btn btn-primary ml-2"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidItemModal;
