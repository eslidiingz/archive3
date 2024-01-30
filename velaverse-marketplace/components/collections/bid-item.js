import { useEffect, useState } from "react";
import { convertEthToWei, setTimestamp, toTimestamp } from "../../utils/number";
import {
  auctionContract,
  avatarContract,
  getWalletAccount,
  itemContract,
} from "../../utils/web3/init";
import Web3 from "web3";
import Config from "../../utils/config.json";
import ButtonState from "../button/button-state";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";
import CustomDatePicker from "../picker/date-picker";

import dayjs from "dayjs";

const BidItemModal = (props) => {
  const [state, setState] = useState(null);
  const [price, setPrice] = useState(1);
  const [terminatePrice, setTerminatePrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [time, setTime] = useState(
    `${dayjs().format("HH")}:${dayjs().format("mm")}`
  );
  const [day, setDay] = useState(new Date().setDate(new Date().getDate() + 1));
  const [sellStatus, setBidStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };

  useEffect(() => {
    setState(props);
    checkApproveContract();
    setAmount(props.data.amount);
  }, [day]);

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

  const checkApproveContract = async () => {
    const account = await getWalletAccount();

    if (props.data.type === "ERC1155") {
      const approve = await itemContract.methods
        .isApprovedForAll(account, Config.MarketAuctionAddress)
        .call();
      setBidStatus(approve);
    } else {
      const approve = await avatarContract.methods
        .isApprovedForAll(account, Config.MarketAuctionAddress)
        .call();
      setBidStatus(approve);
    }
  };

  const setApproveContract = async () => {
    const account = await getWalletAccount();
    if (props.data.type === "ERC1155") {
      await itemContract.methods
        .setApprovalForAll(Config.MarketAuctionAddress, true)
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
          setBidStatus(true);

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
              title={"Transaction failed"}
              description={"Transaction failed please try again"}
            />
          );
        });
    } else {
      await avatarContract.methods
        .setApprovalForAll(Config.MarketAuctionAddress, true)
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
          setBidStatus(true);

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

  const BidListItem = async () => {
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

    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const timeNow = dayjs(day).set("hour", hour).set("minute", minute);
    const timestamp = timeNow.unix();

    let currentTime = timestamp;

    if (Math.ceil(Date.now() / 1000) > currentTime) {
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
    const convertTerminatePrice = convertEthToWei(terminatePrice);
    const listAuctions = await auctionContract.methods.getAllAuction().call();
    let currentAuctionId = listAuctions.length;
    const data = await auctionContract.methods
      .placeAuction(
        props.data.address,
        props.data.tokenId,
        amount,
        priceWeiValue,
        currentTime,
        convertTerminatePrice
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
        let data = {
          market_id: currentAuctionId + "",
          timestamp: currentTime,
        };
        let url = "https://cron.multiverse2021.io/api/data";
        var json = JSON.stringify(data);
        fetch(url, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: json,
          mode: "cors",
          cache: "default",
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (xdata) {
            setLoading(false);
            window.location = `/placements/${props.data.address}/${props.data.tokenId}/${amount}/${account}`;
          });
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

    // if (data.status) {

    // }
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
                    <h2 className="modal-title">Create Bid Item</h2>
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
                            disabled={true}
                            value={amount}
                            min={1}
                            onChange={(e) => handleAmount(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Price (EPIC)</label>
                          <input
                            type="number"
                            disabled={!sellStatus}
                            defaultValue={price}
                            min={1}
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

                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Terminate Price</label>
                          <input
                            type="number"
                            disabled={!sellStatus}
                            defaultValue={terminatePrice}
                            onChange={(e) => setTerminatePrice(e.target.value)}
                            className="form-control"
                          />
                        </div>

                        <div className="col-span-6 mt-2">
                          {sellStatus ? (
                            <ButtonState
                              onFunction={() => BidListItem()}
                              text={"Bid Item"}
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

export default BidItemModal;
