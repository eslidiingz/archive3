import { useEffect, useState } from "react";
import {
  getStrTokenSymbol,
  getTokenSymbol,
  getWalletAccount,
  marketplaceContract,
  offerContract,
  tokenContract,
} from "../../utils/web3/init";
import ButtonState from "../button/button-state";
import Config from "../../utils/config";
import { convertEthToWei, convertTimestampToBlock } from "../../utils/number";
import { unlimit } from "../../utils/global";
import CustomDatePicker from "../picker/date-picker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";
import { isTokenAllowance, SetApproveToken } from "../../utils/checkApprove";

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
    // console.log(data);
    if (state === null) {
      setState(data);

      if (data.market.detail.type === "ERC721") {
        setAmount(props.data.market.detail.item._amount);
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
    const allowance = await isTokenAllowance(
      Config.CLASS_TOKEN_ADDR,
      account,
      "offer"
    );

    if (BigInt(allowance) > 0) {
      setApprove(true);
    }
  };

  const setApproveToken = async () => {
    const account = await getWalletAccount();

    const status = await SetApproveToken(
      Config.CLASS_TOKEN_ADDR,
      account,
      "offer",
      function (status) {
        setLoading(!status);
      }
    );
    if (status.status === true) {
      setApprove(true);
    }
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
    const { _marketId } = state.market.data[1];

    const priceConvert = convertEthToWei(price);
    await offerContract.methods
      .makeOffer(parseInt(_marketId), priceConvert, timestamp, parseInt(amount))
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
        setApprove(true);

        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Make offer item success !!!"}
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

    onClose();
  };

  useEffect(() => {
    checkAllowance();
    fetchDetailData();
    setAmount(props.data.market.detail.item._amount);
  }, [state, day]);

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
              <h2 className="modal-title">Make Offer</h2>
              <div className="lg:space-x-4 flex-col lg:flex-row">
                <div>
                  <div className="overflow-hidden sm:rounded-md">
                    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
                      <div className="col-span-6">
                        <label className="label-modal">Amount</label>
                        <input
                          type="number"
                          value={amount}
                          min={1}
                          disabled={state.placement.type === "ERC721"}
                          onChange={(e) => handleAmount(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-span-6">
                        <label className="label-modal">
                          Price ({getStrTokenSymbol()}) / Amount
                        </label>
                        <input
                          type="number"
                          min={1}
                          defaultValue={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="label-modal">Offer Expiration</label>
                        <div className="mt-1">
                          <CustomDatePicker
                            disabled={!approve}
                            date={day}
                            onFunction={(date) => handleDate(date)}
                          />
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="label-modal">Time</label>
                        <input
                          type="time"
                          disabled={!approve}
                          value={time}
                          onChange={(e) => handleTime(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
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
                          onFunction={() => offerItemList()}
                          text={"Make offer"}
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
      </div>
    </div>
  );
};

export default OfferItemModal;
