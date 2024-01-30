import { memo, useState } from "react";
import Link from "next/link";
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown";
import UseModal from "../modal/Use";
import SellModal from "../modal/Sell";
import dayjs from "dayjs";

const CardAsset = ({
  data = {},
  showUseButton = true,
  handleFetchInventoryItem,
  handleClaimLand,
  handleShowCongratulationCoupon,
  disabledButton = false,
  ...props
}) => {
  const [isNotReady, setNotIsReady] = useState(true);

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setNotIsReady(false);
      // Render a completed state
      return <h4 className="mb-0">Ready to Use</h4>;
    } else {
      setNotIsReady(true);
      // Render a countdown
      return (
        <div className="timer">
          <div className="timer-block">
            <div className="time-count">{zeroPad(days)}</div>
            <div className="time-name">Days</div>
          </div>
          <div className="timer-seperater">:</div>
          <div className="timer-block">
            <div className="time-count">{zeroPad(hours)}</div>
            <div className="time-name">Hours</div>
          </div>
          <div className="timer-seperater">:</div>
          <div className="timer-block">
            <div className="time-count">{zeroPad(minutes)}</div>
            <div className="time-name">Min</div>
          </div>
          <div className="timer-seperater">:</div>
          <div className="timer-block">
            <div className="time-count">{zeroPad(seconds)}</div>
            <div className="time-name">Sec</div>
          </div>
        </div>
      );
    }
  };

  const calculateCountdown = (plantingEndTime) => {
    const now = Date.now();

    const diffTime = plantingEndTime - now;

    return now + diffTime;
  };

  return (
    <>
      <div className="box-card-asste">
        <div className="text-center card-img-sell">
          <div className="asset-img">
            <img src={props.img} />
          </div>
          <div className="card-set-time">
            <Countdown
              date={calculateCountdown(new Date(dayjs(new Date(data?.project?.plantingEndDate)).subtract(7, 'hour').format("YYYY-MM-DD HH:mm:ss")).getTime())}
              renderer={countdownRenderer}
            />
          </div>
        </div>
        <div className="row card-set-text">
          <div className="col-12 mb-2">
            <p className=" fw-bolder mb-2 ">{data?.project?.projectName}</p>
            {/* <p className="text-dot2">
              Cannabis is growing We are growing cannabis plants for you.growing
              cannabis plants for you.
            </p> */}
            <div className="d-flex justify-content-between set-hover">
              <p className="ci-color-green-V1 mb-0 fw-bolder">Project</p>
              <p className="ci-color-green mb-0">{data?.projectId + 1}</p>
            </div>
            <div className="d-flex justify-content-between set-hover">
              <p className="ci-color-green-V1 mb-0 fw-bolder">Zone</p>
              <p className="ci-color-green mb-0">{data?.zone + 1}</p>
            </div>
            <div className="d-flex justify-content-between set-hover">
              <p className="ci-color-green-V1 mb-0 fw-bolder">Token ID</p>
              <p className="ci-color-green mb-0">{data?.assetToken}</p>
            </div>
            {/* <div className="d-flex justify-content-between set-hover">
              <p className="ci-color-green-V1 mb-0 fw-bolder">Price</p>
              <p className="ci-color-green mb-0 d-flex">
                {" "}
                <img
                  className="mx-2"
                  src="/assets/image/project/usd-coin-usdc-logo 2.svg"
                />
                {props.typecoin}
              </p>
            </div> */}
          </div>
          <div className="col-12">
            <div className="row px-1 justify-content-center">
              {/* {showUseButton && (
                <div className={props.classname}>
                  <UseModal
                    data={data}
                    button={props.UseButton}
                    tittle={props.UseTittle}
                    img="/assets/image/card/cannabis.webp"
                    detailmain={props.UseDetailmain}
                    information={props.Useinfomation}
                    inputName02={props.UseInputname02}
                    inputName03={props.UserInputname03}
                    TextPriceuser={props.UserTextprice}
                    handleClaimLand={handleClaimLand}
                    handleFetchInventoryItem={handleFetchInventoryItem}
                    handleShowCongratulationCoupon={handleShowCongratulationCoupon}
                    disabled={isNotReady}
                    // disabled={disabledButton}
                  />
                </div>
              )} */}
              <div className={props.classname}>
                <SellModal
                  data={data}
                  handleFetchInventoryItem={handleFetchInventoryItem}
                />
              </div>
              <div className={props.className}>
                <Link href={"/market/detail"}>
                  <button className="btn-time btn w-100">More Detail</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CardAsset);
