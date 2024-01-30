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
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 lg:col-span-1">
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

                <div className="col-span-3 lg:col-span-2">
                  <div>
                    <h2 className="modal-title">Create Sell Item</h2>
                    <div className="overflow-hidden sm:rounded-md">
                      <div className="grid grid-cols-6 gap-x-6 gap-y-3">
                        <div className="col-span-6">
                          <label className="label-modal">Address</label>
                          <input
                            readOnly
                            disabled
                            type="text"
                            value={props.data.address}
                            className="form-control"
                          />
                        </div>
                        <div className="col-span-6">
                          <label className="label-modal">Token ID</label>
                          <input
                            readOnly
                            disabled
                            type="text"
                            value={props.data.tokenId}
                            className="form-control"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Amount</label>
                          <input
                            type="number"
                            min={1}
                            value={amount}
                            disabled={!sellStatus}
                            onChange={(e) => handleAmount(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">
                            Price (EPIC) / Amount
                          </label>
                          <input
                            type="number"
                            min={1}
                            disabled={!sellStatus}
                            defaultValue={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Date Expiration</label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <CustomDatePicker
                              disabled={!sellStatus}
                              date={day}
                              onFunction={(date) => handleDate(date)}
                            />
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Time</label>
                          <input
                            type="time"
                            disabled={!sellStatus}
                            value={time}
                            onChange={(e) => handleTime(e.target.value)}
                            className="form-control"
                          />
                        </div>

                        <div className="col-span-6 mt-2">
                          {sellStatus ? (
                            <ButtonState
                              onFunction={() => sellListItem()}
                              text={"Sell Item"}
                              loading={loading}
                              classStyle={"btn-theme btn-primary"}
                            />
                          ) : (
                            <ButtonState
                              onFunction={() => setApproveContract()}
                              text={"Approve"}
                              loading={loading}
                              classStyle={"btn-theme btn-primary"}
                            />
                          )}
                          <button
                            onClick={() => onClose()}
                            type="button"
                            className="btn-theme btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
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
