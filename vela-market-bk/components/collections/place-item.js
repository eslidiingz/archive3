import { useEffect, useState } from "react";
import { convertTimestampToBlock, convertEthToWei } from "../../utils/number";
import {
  avatarContract,
  getWalletAccount,
  itemContract,
  marketplaceContract,
} from "../../utils/web3/init";
import Config from "../../utils/config.json";
import ButtonState from "../button/button-state";

import CustomDatePicker from "../picker/date-picker";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";

import dayjs from "dayjs";

const PlaceItemModal = (props) => {
  const [state, setState] = useState(null);
  const [price, setPrice] = useState(1);
  const [amount, setAmount] = useState(0);
  const [day, setDay] = useState(new Date().setDate(new Date().getDate() + 1));
  const [time, setTime] = useState(
    `${dayjs().format("HH")}:${dayjs().format("mm")}`
  );
  const [sellStatus, setSellStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };

  useEffect(() => {
    setState(props);
    checkApproveContract();
    setAmount(props.data.amount);
  }, [day]);

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
    const amount = parseInt(props.data.amount);

    if (value > amount) {
      data = amount;
    } else {
      data = value;
    }
    setAmount(data);
  };

  const checkApproveContract = async () => {
    const account = await getWalletAccount();

    if (props.data.type === "ERC1155") {
      const approve = await itemContract.methods
        .isApprovedForAll(account, Config.MarketPlaceAddress)
        .call();
      setSellStatus(approve);
    } else {
      const approve = await avatarContract.methods
        .isApprovedForAll(account, Config.MarketPlaceAddress)
        .call();
      setSellStatus(approve);
    }
  };

  const setApproveContract = async () => {
    const account = await getWalletAccount();
    if (props.data.type === "ERC1155") {
      await itemContract.methods
        .setApprovalForAll(Config.MarketPlaceAddress, true)
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
          setSellStatus(true);

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
      await avatarContract.methods
        .setApprovalForAll(Config.MarketPlaceAddress, true)
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
          setSellStatus(true);

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
              title={"Transaction Failed"}
              description={"Transaction Failed please try again"}
            />
          );
        });
    }
  };

  const sellListItem = async () => {
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const timeNow = dayjs(day).set("hour", hour).set("minute", minute);
    const timestamp = timeNow.unix();
    const account = await getWalletAccount();

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

    const priceWeiValue = convertEthToWei(price);

    let data = await marketplaceContract.methods
      .placeItem(
        props.data.address,
        props.data.tokenId,
        amount,
        priceWeiValue,
        timestamp
      )
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
      .on("transactionHash", (transaction) => {
        setLoading(true);

        toast(
          <ToastDisplay
            type={"process"}
            title={"Your Transaction"}
            description={"View you transaction"}
            href={`${Config.blockExplorer}/tx/${transaction}`}
          />
        );
      })
      .on("receipt", function (receipt) {
        setLoading(false);

        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Create cell item success !!!"}
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

    if (data.status) {
      window.location = `/placements/${props.data.address}/${props.data.tokenId}/${amount}/${account}`;
    }
  };

  if (!props.show) {
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
          <div className="bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">
              <h2 className="text-xl font-bold text-gray-900">
                Create Sell Item
              </h2>

              <div className="flex lg:space-x-4 mt-4 flex-col lg:flex-row">
                <div className="flex-1">
                  <div className="mt-3 text-right sm:mt-5">
                    <div className="space-y-6">
                      <div className="space-y-6 sm:space-y-5">
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Address
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <input
                              readOnly
                              disabled
                              type="text"
                              value={props.data.address}
                              className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Token ID
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <input
                              readOnly
                              disabled
                              type="text"
                              value={props.data.tokenId}
                              className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Amount
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <input
                              type="number"
                              min={1}
                              value={amount}
                              disabled={!sellStatus}
                              onChange={(e) => handleAmount(e.target.value)}
                              className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Price (EPIC) / Amount
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <input
                              type="number"
                              min={1}
                              disabled={!sellStatus}
                              defaultValue={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Date Expiration
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <CustomDatePicker
                              disabled={!sellStatus}
                              date={day}
                              onFunction={(date) => handleDate(date)}
                            />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Time
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <input
                              type="time"
                              disabled={!sellStatus}
                              value={time}
                              onChange={(e) => handleTime(e.target.value)}
                              className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          {sellStatus ? (
                            <ButtonState
                              onFunction={() => sellListItem()}
                              text={"Sell Item"}
                              loading={loading}
                              classStyle={
                                "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                              }
                            />
                          ) : (
                            <ButtonState
                              onFunction={() => setApproveContract()}
                              text={"Approve"}
                              loading={loading}
                              classStyle={
                                "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                              }
                            />
                          )}

                          <button
                            onClick={() => onClose()}
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div>
                    <img
                      src={
                        props.data.image
                          ? props.data.image
                          : "/assets/image/no-image.png"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceItemModal;
