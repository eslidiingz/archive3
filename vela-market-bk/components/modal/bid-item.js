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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-2/4 sm:p-4">
          <p className="text-2xl font-bold justify-center items-center">
            Bid Item
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
              <section aria-labelledby="recent-heading" className="mt-6">
                <h2 id="recent-heading" className="sr-only">
                  Recent orders
                </h2>

                <div className="space-y-20">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Bid Price
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <ButtonState
                      onFunction={() => bidItem()}
                      text={"Confirm"}
                      loading={loading}
                      classStyle={
                        "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      }
                    />
                  </div>
                  <div>
                    <table className="mt-4 w-full text-gray-500 sm:mt-6">
                      <caption className="sr-only">Products</caption>
                      <thead className="sr-only text-sm text-gray-500 text-left sm:not-sr-only">
                        <tr>
                          <th
                            scope="col"
                            className="sm:w-2/5 lg:w-1/3 pr-8 py-3 font-normal"
                          >
                            Wallet Address
                          </th>
                          <th
                            scope="col"
                            className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell"
                          >
                            Price (EPIC)
                          </th>
                          <th
                            scope="col"
                            className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="hidden w-1/5 pr-8 py-3 font-normal sm:table-cell"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border-b border-gray-200 divide-y divide-gray-200 text-sm sm:border-t">
                        {props.data.map((x, index) => {
                          return (
                            <tr key={index}>
                              <td className="py-6 pr-8">{x["_buyer"]}</td>
                              <td className="hidden py-6 pr-8 sm:table-cell">
                                {numberFormat(convertWeiToEther(x["_price"]))}
                              </td>
                              <td className="hidden py-6 pr-8 sm:table-cell">
                                {x["_time"]
                                  ? untilTime(x["_time"])
                                  : untilTime(Date.now())}
                              </td>
                              <td className="hidden py-6 pr-8 sm:table-cell">
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
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidItemModal;
