import { useEffect, useState } from "react";
import {
  convertEthToWei,
  convertWeiToEther,
  numberFormat,
} from "../../utils/number";
import {
  getStrTokenSymbol,
  getWalletAccount,
  marketplaceContract,
  tokenContract,
  whitelistContract,
  web3,
} from "../../utils/web3/init";
import Config from "../../utils/config";
import ButtonState from "../button/button-state";

import CustomDatePicker from "../picker/date-picker";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";

import dayjs from "dayjs";
import { getAssetByAddressToken } from "../../utils/api/asset-api";
import {
  putTransactionCollection,
  fetchCollectionByAssetId,
} from "../../utils/api/collection-api";
import { useRouter } from "next/router";
import {
  isContractApprove,
  isTokenAllowance,
  SetApproveContract,
  SetApproveToken,
} from "../../utils/checkApprove";
import { getPlaceItemRateFee } from "../../utils/web3/token";
const PlaceItemModal = (props) => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [price, setPrice] = useState(1);
  const [amount, setAmount] = useState(1);
  const [day, setDay] = useState(new Date().setDate(new Date().getDate() + 1));
  const [time, setTime] = useState(
    `${dayjs().format("HH")}:${dayjs().format("mm")}`
  );
  const [sellStatus, setSellStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [approveToken, setApproveToken] = useState(false);
  const [approveContract, setApproveContract] = useState(false);
  const [fee, setFee] = useState({
    fee: 0,
    status: false,
  });
  const [placementFee, setPlacementFee] = useState(2);

  const onClose = (event) => {
    props.onClose && props.onClose(event);
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
    const amount = parseInt(props.data.amount);

    if (value > amount) {
      data = amount;
    } else {
      data = value;
    }
    setAmount(data);
  };

  const checkApproveToken = async () => {
    const account = await getWalletAccount();
    const allowance = await isTokenAllowance(
      Config.CLASS_TOKEN_ADDR,
      account,
      "market"
    );

    if (BigInt(allowance) > 0) {
      setApproveToken(true);
    }
  };
  const checkApproveContract = async () => {
    const account = await getWalletAccount();

    const isApprove = await isContractApprove(
      props.data.address,
      account,
      "offer"
    );
    const fee = await getPlaceItemRateFee();
    setPlacementFee(fee);
    setApproveContract(isApprove);
  };

  const setApprovalContract = async (type) => {
    const account = await getWalletAccount();
    const status = await SetApproveContract(
      props.data.address,
      account,
      "offer",
      function (status) {
        setStatusLoading({
          index: type,
          loading: !status,
        });
      }
    );

    if (status.status === true) {
      setApproveContract(true);
    }
  };

  const setAllowanceToken = async (type) => {
    const account = await getWalletAccount();

    const status = await SetApproveToken(
      Config.CLASS_TOKEN_ADDR,
      account,
      "market",
      function (status) {
        setStatusLoading({
          index: type,
          loading: !status,
        });
      }
    );

    if (status.status === true) {
      setApproveToken(true);
    }
  };

  const sellListItem = async () => {
    try {
      const hour = time.split(":")[0];
      const minute = time.split(":")[1];
      const timeNow = dayjs(day).set("hour", hour).set("minute", minute);
      const timestamp = timeNow.unix();
      const account = await getWalletAccount();
      if (!price && price <= 0) {
        toast(
          <ToastDisplay
            type={"error"}
            title={"Incorrect Price"}
            description={"Please check price."}
          />
        );
        return;
      }
      if (!amount || amount <= 0) {
        toast(
          <ToastDisplay
            type={"error"}
            title={"Incorrect Amount"}
            description={"Please check amount."}
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
          timestamp,
          Config.CLASS_TOKEN_ADDR
        )
        .send({ from: account })
        .on("sending", function (result) {
          setStatusLoading({
            index: "placement",
            loading: true,
          });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("transactionHash", (transaction) => {
          // console.log(transaction);
          setStatusLoading({
            index: "placement",
            loading: true,
          });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Your Transaction"}
              description={"View you transaction"}
              href={`${Config.BLOCK_EXPLORER}/tx/${transaction}`}
            />
          );
        })
        .on("receipt", function (receipt) {
          setStatusLoading({
            index: "placement",
            loading: false,
          });

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction reciept"}
              description={"Create cell item success !!!"}
              href={`${Config.BLOCK_EXPLORER}/tx/${receipt.transactionHash}`}
            />
          );
          setTimeout(() => {
            location.reload();
          }, 500);
        })
        .on("error", function (error) {
          setStatusLoading({
            index: "placement",
            loading: false,
          });

          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction rejected"}
              description={error.message}
            />
          );
        });

      if (data.status) {
        const asset = await getAssetByAddressToken(
          props.data.address,
          props.data.tokenId
        );
        const collectionId = await fetchCollectionByAssetId(asset.rows[0]._id);

        const transaction = {
          item: props.data.address,
          token: props.data.tokenId,
          user: account,
          price: price,
        };
        const _result = await putTransactionCollection(
          collectionId[0]._id,
          transaction
        );

        // window.location = `/placements/${props.data.address}/${props.data.tokenId}/${amount}/${account}`;
        window.location = `/placements`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const checkFee = async () => {
  //   const _price = price <= 0 ? 0 : parseInt(price);
  //   const _fee = await whitelistContract.methods.getFee(_price).call();
  //   const _feeCharge = web3.utils.toNumber(_fee);
  //   const account = await getWalletAccount();
  //   const _balance = await tokenContract.methods.balanceOf(account).call();
  //   const balance = await convertWeiToEther(_balance);

  //   const _status = balance < _feeCharge ? false : true;
  //   setFee({
  //     fee: _feeCharge,
  //     status: _status,
  //   });
  // };

  useEffect(() => {
    // console.log(props);
    setState(props);
    checkApproveToken();
    checkApproveContract();
    setAmount(props.data.amount);
    // checkFee();
  }, [day, price]);

  if (!props.show) {
    return null;
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="area-modal">
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
            <div className="bg-modal-warpper max-w-3xl mx-auto p-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:p-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 lg:col-span-1">
                  <div>
                    <img
                      src={
                        props.data.image
                          ? props.data.image
                          : "/assets/image/no-image.jpg"
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/assets/image/no-image.jpg";
                      }}
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
                        {/* <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Amount</label>
                          <input
                            type="number"
                            min={1}
                            value={amount}
                            disabled={!approveContract || !approveToken}
                            onChange={(e) => handleAmount(e.target.value)}
                            className="form-control"
                          />
                        </div> */}
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">
                            Price ({getStrTokenSymbol()})
                          </label>
                          <input
                            type="number"
                            min={1}
                            disabled={!approveContract || !approveToken}
                            defaultValue={price}
                            onChange={(e) => {
                              if (e.target.value < 0) {
                                e.target.value = 0;
                              } else {
                                setPrice(e.target.value);
                              }
                            }}
                            className="form-control"
                          />
                        </div>
                        {/* <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Date Expiration</label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <CustomDatePicker
                              disabled={!approveContract || !approveToken}
                              date={day}
                              onFunction={(date) => handleDate(date)}
                            />
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label className="label-modal">Time</label>
                          <input
                            type="time"
                            disabled={!approveContract || !approveToken}
                            value={time}
                            onChange={(e) => handleTime(e.target.value)}
                            className="form-control"
                          />
                        </div> */}

                        <div className="col-span-6 mt-2 flex items-center ">
                          {approveContract && approveToken && (
                            <ButtonState
                              onFunction={() => sellListItem()}
                              text={"Sell Item"}
                              loading={
                                statusLoading.index === "placement" &&
                                statusLoading.loading === true
                              }
                              classStyle={"btn-theme btn-primary"}
                            />
                          )}
                          {!approveToken && (
                            <ButtonState
                              onFunction={() => setAllowanceToken("token")}
                              text={"Approve Token"}
                              loading={
                                statusLoading.index === "token" &&
                                statusLoading.loading === true
                              }
                              classStyle={"btn-theme-long btn-primary"}
                            />
                          )}
                          {approveToken && !approveContract && (
                            <ButtonState
                              onFunction={() => setApprovalContract("contract")}
                              text={"Approve Contract"}
                              loading={
                                statusLoading.index === "contract" &&
                                statusLoading.loading === true
                              }
                              classStyle={"btn-theme-long btn-primary"}
                            />
                          )}
                          <button
                            onClick={() => onClose()}
                            type="button"
                            className="btn-theme btn-secondary ml-4"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-span-6 mt-2">
                          Fee Charge ({placementFee} %) :{" "}
                          {numberFormat(
                            placementFee && price
                              ? (placementFee * price) / 100
                              : 0
                          )}{" "}
                          {getStrTokenSymbol()}
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
