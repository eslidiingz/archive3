import { memo, useState } from "react";
import dayjs from "dayjs";
import Countdown, { zeroPad } from "react-countdown";
// import { useWalletContext } from "../../context/wallet";

const ProjectCard = ({
  index,
  land,
  projectName = '',
  projectId,
  amountLeft = 0,
  startSaleAt = 0,
  endSaleAt = 0,
  handleClickBuyZone,
  projectDetail,
  claimAt,
  handleFetchActiveProject
}) => {
  const [isNotReady, setIsNotReady] = useState(true);

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // handleRemoveEndedProject(index);
      // Render a completed state
      setIsNotReady(true);
      return <>
        <div className="h-time-set">
            <p className="text-center fw-bolder mb-2">Open For Sell</p>
            <div className="countdown">
              <h4 className="text-center fw-bolder">{renderPreSellDate()}</h4>
            </div>
        </div>
      </>;
    } else {
      // Render a countdown
      setIsNotReady(false);
      return (
        <>
          <div className="h-time-set">
              <p className="text-center fw-bolder mb-2">On Sell</p>
              <div className="countdown">
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
                    <div className="time-name">Minutes</div>
                  </div>
                  <div className="timer-seperater">:</div>
                  <div className="timer-block">
                    <div className="time-count">{zeroPad(seconds)}</div>
                    <div className="time-name">Seconds</div>
                  </div>
                </div>
              </div>
          </div>
        </>
      );
    }
  };

  const isSameYear = () => {
    let startYear = null;
    let endYear = null;

    if (startSaleAt) startYear = new Date(startSaleAt).getFullYear();
    if (endSaleAt) endYear = new Date(endSaleAt).getFullYear();

    return (startYear || endYear) && startYear === endYear;
  };

  const renderPreSellDate = () => {
    let preSelling = "";

    const sameYear = isSameYear();
    // if (Date.now() < endSaleAt) {
    if (startSaleAt) {
      const startSaleAtObj = new Date(startSaleAt);
      preSelling = dayjs(startSaleAtObj).format(
        `DD MMM${sameYear ? "" : " YYYY"}`
      );
    }

    if (endSaleAt) {
      const endSaleAtObj = new Date(endSaleAt);
      preSelling += ` - ${dayjs(endSaleAtObj).format("DD MMM YYYY")}`;
    }
    // }

    // setProjectDetail((prevState) => ({...prevState, openPreSell: preSelling}));

    return preSelling;
  };

  const plusDate = (dateTime, date) => {
    if (!dateTime) return "";
    
    return dayjs(dateTime).add(date, 'day').format("DD MMM YYYY");
  };

  const renderStartPlantingDate = () => {
    let startPlating = "";

    if (endSaleAt) {
      const endSaleAtObj = new Date(endSaleAt);
      startPlating = dayjs(endSaleAtObj).set("date", 7).format("DD MMM YYYY")
      // setProjectDetail((prevState) => ({...prevState, startPlanting: startPlating}));
    }

    return startPlating;
  };

  const renderDateToUse = () => {
    let dateToUse = "";

    if (claimAt) {
      const claimAtObj = new Date(claimAt);
      dateToUse = dayjs(claimAtObj).format("DD MMM YYYY")
      // dateToUse = plusDate(claimAt, 1);
      // setProjectDetail((prevState) => ({...prevState, readyToUseAt: dateToUse}));
    }
    return dateToUse;
  };

  const calculateCountdown = () => {
    const now = Date.now();

    const diffTime = endSaleAt - now;

    return now + diffTime;
  };

  return (
      <div className={`box-project ${!isNotReady ? "on-selling" : ""}`}>
        <div className="position-rela">
          {/* <img
            src={`/assets/image/project/greenhouse${land % 2 === 0 ? 1 : 2}.webp`}
            className="w-100"
          /> */}
           <img
            src={`/assets/image/project/greenhouse.webp`}
            className="w-100"
          />
        </div>
        <div className="position-text-box">
          <Countdown
              date={calculateCountdown()}
              renderer={countdownRenderer}
          />
          <h4 className="text-white fw-bolder">{projectName}</h4>
          <h5 className="text-white fw-bolder">Zone {land + 1}</h5>
          <div className="row set-text-zone1">
            <div className="col-6">
              <p className="ci-white-op-50 ">Open for sale</p>
            </div>
            <div className="col-6 text-end">
              <p className="text-white ">{renderPreSellDate()}</p>
            </div>
            <div className="col-6">
              <p className="ci-white-op-50 ">Start planting</p>
            </div>
            <div className="col-6 text-end">
              <p className="text-white ">{renderStartPlantingDate()}</p>
            </div>
            {/* <div className="col-6">
              <p className="ci-white-op-50 ">Claim Date</p>
            </div>
            <div className="col-6 text-end">
              <p className="text-white ">{claimAt}</p>
            </div> */}
            <div className="col-6">
              <p className="ci-white-op-50 ">Date to use</p>
            </div>
            <div className="col-6 text-end">
              <p className="text-white ">{renderDateToUse()}</p>
            </div>
            <div className="col-6">
              <p className="ci-white-op-50 ">Price</p>
            </div>
            <div className="col-6 text-end">
              <p className="text-white ">
                <img
                  className="mx-1"
                  src="/assets/image/project/usd-coin-usdc-logo 2.svg"
                />
                {projectDetail.price} USDC
              </p>
            </div>
            <div className="col-6">
              <p className="ci-white-op-50 ">Amount Left</p>
            </div>
            <div className="col-6 text-end">
              <p className="text-white ">{amountLeft}</p>
            </div>
          </div>
          {!isNotReady ? (
            <button
              className="btn-project btn d-flex align-items-center justify-content-center mt-3"
              onClick={() =>
                handleClickBuyZone(land, {
                  projectId,
                  projectName: projectName,
                  openPreSell: renderPreSellDate(),
                  startPlanting: renderStartPlantingDate(),
                  platingDuration: 180,
                  readyToUseAt: renderDateToUse(),
                  price: projectDetail.price,
                })
              }
            >
              <img
                className="mx-2"
                src="/assets/image/project/001-shopping.svg"
              />
              Buy Now
              <img
                className="mx-2"
                src="/assets/image/project/usd-coin-usdc-logo 2.svg"
              />
              {projectDetail.price} USDC
            </button>
          ) : (
            <button
              className={`btn-project btn d-flex align-items-center justify-content-center mt-3`}
              disabled
            >
              <img
                className="mx-2"
                src="/assets/image/project/001-shopping.svg"
              />
              Coming Soon
            </button>
          )}
        </div>
      </div>
  );
};

export default ProjectCard;