import React, { Component } from "react";
import Slider from "react-slick";
import Link from "next/link";
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      data-role="none"
      class="arrow-next-customs"
      onClick={onClick}
    ></button>
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <button
      type="button"
      data-role="none"
      class="arrow-prev-customs"
      onClick={onClick}
    ></button>
  );
}

export default class SliderSimple extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
          },
        },
        {
          breakpoint: 1068,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        return <Completionist />;
      } else {
        // Render a countdown
        return (
          <div className="time_homepage">
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
    return (
      <>
        <Slider {...settings}>
          <div className="col-12 col-md-6 col-lg-6 px-1">
            <div className="card">
              <div className="layout-slider-homepage">
                <div className="d-flex justify-content-center">
                  <img
                    src="/assets/image/homepage/Group_576.svg"
                    className="img-slider-homesec7"
                    alt="..."
                  />
                </div>
              </div>
              <div className="d-flex align-items-center ms-3">
                <p className="text-card-number_homepage layout-card_number">
                  1
                </p>
                <p className="text-card-detail_homepage">Buy Siam Cannabis NFT</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6 px-1">
            <div className="card">
              <div className="layout-slider-homepage">
                <div className="mt-2">
                  <div className="d-flex justify-content-center">
                    <div className="set-time_homepage">
                      <Countdown
                        date={Date.now() + 850000000}
                        renderer={renderer}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <img
                      src="/assets/image/homepage/Group_576-1.png"
                      className="img-slider-homesec8"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center ms-3">
                <p className="text-card-number_homepage layout-card_number">
                  2
                </p>
                <p className="text-card-detail_homepage">Grow up 180 days</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6 px-1">
            <div className="card">
              <div className="layout-slider-homepage d-flex justify-content-center align-items-center">
                {/* <div className="d-flex justify-content-center"> */}
                  <p className="text-header-card">15%</p>
                {/* </div> */}
                {/* <div className="d-flex justify-content-center height-sce03">
                  <p className="text-sub-card">Guarantee</p>
                </div> */}
              </div>

              <div className="d-flex align-items-center ms-3 ">
                <p className="text-card-number_homepage layout-card_number">
                  3
                </p>
                <p className="text-card-detail_homepage">Use NFT to get return plus 15%</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6 px-1">
            <div className="card">
              <div className="layout-slider-homepage">
                <div className="d-flex justify-content-center">
                  <img
                    src="/assets/image/homepage/Group_576-2.png"
                    className="img-slider-homesec9"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center ms-3">
                <p className="text-card-number_homepage layout-card_number">
                  4
                </p>
                <p className="text-card-detail_homepage">
                  Privileges from the clinic
                </p>
              </div>
            </div>
          </div>
        </Slider>
      </>
    );
  }
}
