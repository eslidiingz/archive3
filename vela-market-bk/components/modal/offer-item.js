import { useEffect, useState } from "react";
import {
  getWalletAccount,
  marketplaceContract,
  tokenContract,
} from "../../utils/web3/init";
import ButtonState from "../button/button-state";
import Config from "../../utils/config.json";
import { convertEthToWei, convertTimestampToBlock } from "../../utils/number";
import { unlimit } from "../../utils/global";
import CustomDatePicker from "../picker/date-picker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";

const OfferItemModal = (props) => {
  const [approve, setApprove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(1);
  const [day, setDay] = useState(new Date().setDate(new Date().getDate() + 1));
  const [time, setTime] = useState(
    `${dayjs().format("HH")}:${dayjs().format("mm")}`
  );
  const [amount, setAmount] = useState(0);
  const [state, setState] = useState(null);

  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };

  const fetchDetailData = () => {
    const { data } = props;
    if (state === null) {
      setState(data);

      if (data.placement.type === "ERC721") {
        setAmount(parseInt(data.placement.item._amount));
      }
    }
  };

  const handleDate = (value) => {
    setDay(value);
  };

  const handleTime = async (value) => {
    const date = new Date(day);
    const hours = new Date(date.setHours(new Date().getHours()));
    const minute = new Date(hours.setMinutes(new Date().getMinutes()));
    const valueDate = dayjs(new Date(minute))
      .set("hour", value.split(":")[0])
      .set("minute", value.split(":")[1]);

    const nowDate = dayjs(new Date());
    const diff = valueDate.diff(nowDate, "hour");

    if (diff >= 24) {
      setTime(value);
    } else {
      setTime(`${dayjs().format("HH")}:${dayjs().format("mm")}`);
    }
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
    const allowance = await tokenContract.methods
      .allowance(account, Config.MarketPlaceAddress)
      .call();

    if (state === null) {
      if (allowance <= 0) {
        setApprove(false);
      } else {
        setApprove(true);
      }
    }
  };

  const setApproveToken = async () => {
    const account = await getWalletAccount();

    const approve = await tokenContract.methods
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
  };

  const offerItemList = async () => {
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const timeNow = dayjs(day).set("hour", hour).set("minute", minute);
    const timestamp = timeNow.unix();

    if (price <= 0) {
      toast(
        <ToastDisplay
          type={"error"}
          title={"Incorrect Price"}
          description={"Please check price."}
        />
      );
      return;
    }

    if (Math.ceil(Date.now() / 1000) > timestamp) {
      toast(
        <ToastDisplay
          type={"error"}
          title={"Incorrect Expiration"}
          description={"Please check expiration."}
        />
      );
      return;
    }

    const account = await getWalletAccount();
    const { _marketId } = state.placement.item;

    const priceConvert = convertEthToWei(price);
    await marketplaceContract.methods
      .makeOffer(parseInt(_marketId), priceConvert, timestamp, parseInt(amount))
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
            description={"Make offer item success !!!"}
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

    onClose();
  };

  useEffect(() => {
    checkAllowance();
    fetchDetailData();
    setAmount(props.data.placement.item._amount);
  }, [state, day]);

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
            Make Offer
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
          <div className="space-x-4">
            <main className="mx-4">
              <section className="mt-6">
                <div className="space-y-20">
                  <div>
                    <div className="mt-12">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                          <label className="block text-lg font-bold text-black">
                            Amount
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              value={amount}
                              min={1}
                              disabled={state.placement.type === "ERC721"}
                              onChange={(e) => handleAmount(e.target.value)}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-lg font-bold text-black">
                            Price (EPIC) / Amount
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              min={1}
                              defaultValue={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-lg font-bold text-black">
                            Offer Expiration
                          </label>
                          <div className="mt-1">
                            <CustomDatePicker
                              disabled={!approve}
                              date={day}
                              onFunction={(date) => handleDate(date)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-lg font-bold text-black">
                            Time
                          </label>
                          <div className="mt-1">
                            <input
                              type="time"
                              disabled={!approve}
                              value={time}
                              onChange={(e) => handleTime(e.target.value)}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-3 mx-4 bg-gray-400 text-base font-medium text-white  sm:text-sm"
              >
                Cancel
              </button>
              {approve ? (
                <ButtonState
                  onFunction={() => offerItemList()}
                  text={"Make offer"}
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

export default OfferItemModal;
