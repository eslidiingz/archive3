import { useState } from "react";
import {
  untilTime,
  convertWeiToEther,
  convertEthToWei,
  numberFormat,
} from "../../utils/number";
import ButtonState from "../button/button-state";
import {
  auctionContract,
  getWalletAccount,
  tokenContract,
} from "../../utils/web3/init";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";
import { getWalletAddress } from "../../utils/wallet/connector";

const BidItemModal = (props) => {
  const [bidPrice, setBidPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };

  if (!props.show) {
    return null;
  }
  const bidItem = async () => {
    const latestPrice = parseFloat(props.data[0]["_price"]);
    let bidPrices = convertEthToWei(bidPrice);
    if (bidPrices <= 0 || bidPrices <= latestPrice) {
      bidPrices = 0;

      toast(
        <ToastDisplay
          type={"error"}
          title={"Transaction Failed"}
          description={`Bid price must greater than current (${convertWeiToEther(
            latestPrice
          )} EPIC) `}
        />
      );

      return;
    }
    const account = await getWalletAccount();
    let marketId = parseInt(props.item.placement.item["_marketId"]);
    const convertBidPrice = convertEthToWei(bidPrice);

    const result = await auctionContract.methods
      .bidItem(marketId, convertBidPrice)
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
    location.reload();
  };
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
                Bid Item
              </p>
              <table className="table-theme table-scroll-end mt-6">
                <thead>
                  <tr>
                    <th>Wallet Address</th>
                    <th>Price (EPIC)</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {props.data.map((x, index) => {
                    return (
                      <tr key={index}>
                        <td>{getWalletAddress(x["_buyer"])}</td>
                        <td>{numberFormat(convertWeiToEther(x["_price"]))}</td>
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
              <div className="flex justify-end items-end mt-4">
                <div>
                  <label className="label-modal">Bid Price</label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <ButtonState
                    onFunction={() => bidItem()}
                    text={"BID"}
                    loading={loading}
                    classStyle={"btn-theme bg-bid btn-small ml-4 mr-0"}
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
