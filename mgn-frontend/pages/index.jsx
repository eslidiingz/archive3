import { useEffect, useState } from "react";
import Mainlayout from "../components/layouts/Mainlayout";
import React from "react";
import Link from "next/link";
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown";
import Accordion from "react-bootstrap/Accordion";
import SliderSimple from "../components/slider/SliderSimple";

const presalePage = () => {
  const [setbtn, setButtonText1] = useState(false);
  const [tokenState, setTokenState] = useState(false);
  const [enteredTokenList, setEnteredTokenList] = useState([
    { tokenName: 'CNB', value: 0, ImgSrc: "/assets/image/card/coin-cnb.svg", Settextcoin: "9000" }, //0
    { tokenName: 'USDC', value: 0, ImgSrc: "/assets/image/card/coin-usdc.svg", Settextcoin: "1000" },//1
  ]);

  const onChangeToken = (e) => {
    setEnteredTokenList((prevState) => ([prevState[1], prevState[0]]));
    setTokenState(!tokenState);
    setButtonText1(!setbtn);
  };

  const handleChangeTokenAmount = (e, index) => {
    setEnteredTokenList((prevState) => {
      const tempState = [...prevState];
      tempState[index].value = e.target.value;
      return tempState;
    });
  };


  return (
    <>
      <section>
        <section className="hilight-section_homepage">
          <div className="container">
            <div className="row">
              <div className="col-12 d-lg-none d-block">
                <img
                  src="/assets/image/homepage/Group_547.svg"
                  className="img-banner_main_homepage"
                />
              </div>

              <div className="col-lg-5 mb-lg-3">
                <p className="text_welcome m-0">Welcome to</p>
                <p className="text-header_homepage m-0">Siam Cannabis</p>
                <p className="text-detail_homrpage mb-3">
                  We are an investment platform that built on the commitment to develop the Thai cannabis business. Along with answering the needs of today's investments that must be modern, stable and safe as possible with the Blockchain system.
                </p>
                <div className="ul-set w-100">
                  <ul className="mb-0">
                    <div className="layout-social_homepage">
                      <Link href={"https://www.facebook.com/Siam-Cannabis-107505868658162"}>
                        <a target="_blank">
                          <i className="fab fa-facebook icon-social_homepage icon-facebook_homepage"></i>
                        </a>
                      </Link>
                    </div>
                    <div className="layout-social_homepage">
                      <Link href={"https://www.facebook.com/Siam-Cannabis-107505868658162"}>
                        <a target="_blank">
                          <i className="fab fa-facebook-messenger icon-social_homepage icon-ms-facebook_homepage icon-ms-facebook_homepage"></i>
                        </a>
                      </Link>
                    </div>
                    <div className="layout-social_homepage">
                      <Link href={"https://manager.line.biz/account/@691gheed"}>
                        <a target="_blank">
                          <img
                            src="/assets/image/footer/icon-Line3.svg"
                            className="icon-img-social_homepage icon-img-social_homepage"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="layout-social_homepage">
                      <Link href={"https://www.youtube.com/channel/UCFkHLfcJ-AUjjKElH0hBuVg"}>
                        <a target="_blank">
                          <i className="fab fa-youtube icon-social_homepage mx-0 icon-youtube_homepage"></i>
                        </a>
                      </Link>
                    </div>
                  </ul>
                </div>
              </div>
              <div className="col-lg-7 d-none d-lg-flex">
                <img
                  src="/assets/image/homepage/Group_547.svg"
                  className="img-banner_main_homepage"
                />
              </div>

              <div className="row layout-banner_homepage">
                <div className="col-lg-5 p-0 pt-5">
                  <div className="text-banner-L_homepage">
                    {/* <p className="text-banner-tittle_homepage">Guarantee</p> */}
                    <p className="text-banner-tittle2_homepage">15%</p>
                    <p className="text-banner-tittle3_homepage">
                      Benefit after
                    </p>
                    <p className="text-banner-tittle3_homepage"> 6 Month</p>
                  </div>
                  <div className="d-flex justify-content-center d-none d-lg-block">
                    <img
                      src="/assets/image/footer/Group_544.png"
                      className="img-banner-sub_homepage"
                    />
                  </div>
                </div>
                <div className="col-lg-7 col-12 px-sm-5 px-3">
                  <p className="text-header-R_homepage px-md-5">
                    SUT Project Open for Sale
                  </p>
                  <p className="text-tittle-R_homepage pb-3">
                    LET’s Grow Up Your Plant
                  </p>

                  <ul className="ul-R_homepage">
                    <li>Open for sale Zone 1 on 6 July 2022 - 4 Aug 2022.</li>
                    <li>
                      Wait until the age of 180 will be able to be sold back to
                      CNB 15%.
                    </li>
                    <li>Start planting together on 6 July 2022 - 4 Aug 2022.</li>
                    <li>Open Zone 2 Upcoming.</li>
                    <li>
                      During planting, you can can exchange your NFT freely
                      which has a 3% fee after reselling
                    </li>
                  </ul>
                  <Link href={"/project"}>
                    <div className="d-flex justify-content-center">
                      <button className="btn-project_homepage">
                        <img
                          src="/assets/image/footer/012-project-1.svg"
                          className="px-lg-2"
                        />
                        Go to Project
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="container">
            <div className="row fix-container layout-card">
              <div className="col-12">
                <p className="text-tittle_sec2-hp">Simple Steps to play</p>
              </div>
              <SliderSimple />
            </div>
          </div>
        </section>

        <section className="layout-section03_homepage">
          <div className="container">
            <div className="row fix-container">
              <div className="col-xl-4 col-lg-4 col-md-6 col-12 mb-5">
                <img
                  src="/assets/image/homepage/Group.svg"
                  className="img-icon_sec03 pb-2"
                  alt="..."
                />
                <p className="text-header_sec03 pt-1">Siam cannabis NFT</p>
                <div className="layout-card-who_sce03">
                  <p className="text-detail-card_sec03">
                    The members who hold Siam cannabis NFT will receive profits
                    of CNB tokens from membership price (after 6 months of
                    membership) and also will receive additional privileges from
                    the clinic.
                  </p>
                </div>
                <div className="btn-bg-card_sec03">
                  <p className="text-btn-card_sec03 mb-0">
                    Price : 300 USDC per 6 months / 1 privileges
                  </p>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12 mb-5">
                <img
                  src="/assets/image/homepage/017-coin.svg"
                  className="img-icon_sec03"
                  alt="..."
                />
                <p className="text-header_sec03">CNB token</p>
                <div className="layout-card-who_sce03">
                  <p className="text-detail-card_sec03">
                    Tokenomics system of our project will operate by using 2
                    main types of token including CNB and USDC. The value of the
                    CNB token will be pegged by the reliable USD Coin (USDC)
                    token
                  </p>
                </div>
                <div className="btn-bg-card_sec03">
                  <p className="text-btn-card_sec03">
                    6 Months CNB Token Generation Rate = 1 CNB : 1 USDC
                  </p>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12 mb-5">
                <img
                  src="/assets/image/homepage/039-star.svg"
                  className="img-icon_sec03"
                  alt="..."
                />
                <p className="text-header_sec03">Benefits of CNB token</p>
                <div className="layout-card-who_sce03">
                  <p className="text-detail-card_sec03">
                    Siam Cannabis privileges members who continuously hold for 6
                    consecutive months will receive CNB tokens 15% with a
                    guarantee from Siam Cannabis NFT price and also will receive
                    additional privileges from the clinic.The members can sell
                    their NFT as needed through the marketplace system which is
                    able to increase the value unlimitedly
                  </p>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12 mb-5">
                <img
                  src="/assets/image/homepage/045-store.svg"
                  className="img-icon_sec03"
                  alt="..."
                />
                <p className="text-header_sec03">Marketplace</p>
                <div className="layout-card-who_sce03">
                  <p className="text-detail-card_sec03">
                    Marketplace is the Buy / Sell system is used for trading
                    your NFT so that the owner can exchange their NFT freely.{" "}
                  </p>
                  <ul>
                    <li className="text-detail-card_sec03">
                      From the opening period (2 months) to the closing period
                      (6 months)
                    </li>
                    <li className="text-detail-card_sec03">
                      You can sell your NFT through the marketplace system (3%
                      fee after selling)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12 mb-5">
                <img
                  src="/assets/image/homepage/045-heal.svg"
                  className="img-icon_sec03"
                  alt="..."
                />
                <p className="text-header_sec03">Privileges from the clinic</p>
                <div className="layout-card-who_sce03">
                  <p className="text-detail-card_sec03">
                    The members who hold Siam Cannabis NFT will receive a
                    discount and privileges in purchasing goods and services
                    within the agricultural shop, Thai traditional medicine
                    clinic, and other partners in the project.
                  </p>
                </div>
              </div>
              <div className="col-12">
                <Link href={"https://siamcannabis-io.gitbook.io/white-paper-update/"}>
                  <a target="_blank">
                    <div className="d-flex justify-content-center">
                      <button className="btn-sec03">
                        <img
                          src="/assets/image/homepage/030-newspaper.svg"
                          className="px-2"
                        />
                        Read more white paper
                      </button>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>


        <section>
          <div className="container">
            <div className="row box-Swap-home">
              <div className="col-lg-7 col-12 text-end p-3 d-lg-block d-none">
                <div>
                  <img src="/assets/image/homepage/swapcoin1.png" className="px-lg-2 width-100-sm " />
                  <h3>swap cannabis coin</h3>
                  <p>CNB is a Stablecoin</p>
                  <p>CNB /USDC ratio = 1:1</p>
                </div>
              </div>
              <div className="col-lg-5 col-12 text-center p-3">
                <h5 className="mt-3">Swap Cannabis Coin </h5>
                <div className="d-flex align-items-center justify-content-center h-75">
                  <p className="text_comingsoon">COMING SOON</p>
                </div>
                {/* {enteredTokenList.map((tokenDetail, index) => (
                  <>
                    <div className={`box-Swap-1  p-2 ${index === 0 ? "relative-Swap-1" : "relative-Swap-2"}`}>
                      <div className="d-flex justify-content-between align-content-center">
                        <div className="d-flex align-items-center">
                          <img src={tokenDetail.ImgSrc} className="img_swap" />
                          <p className="ms-2 fw-bolder text_swap-price"> {tokenDetail.tokenName}</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            className="swap-input swap-set-input"
                            value={tokenDetail.value}
                            onChange={(e) => handleChangeTokenAmount(e, index)}
                          />
                        </div>
                      </div>
                      <p className="ci-color-gray text-end">Your Balance : {tokenDetail.Settextcoin}</p>
                    </div>

                    {index === 0 &&
                      <div className="relative-Swap-0"  >
                        <button
                          className="btn-transparent"
                          type="submit"
                          onClick={onChangeToken} >
                          <img src="/assets/image/icon/arrow-up-down.svg" />
                        </button>
                      </div>}

                  </>
                ))}

                {setbtn ?
                  <button className="btn btn-time">Swap USDC to CNB</button> : <button className="btn btn-time">Swap CNB to USDC</button>
                } */}


                {/* <div className="d-flex justify-content-between ">
                  <p className="ci-color-gray">Transaction Cost :</p>
                  <p className="ci-color-gray">9999 USDC</p>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        <section className="layout-section03_homepage">
          <div className="container">
            <div className="row fix-container ">
              <div className="col-12">
                <p className="text-tittle_sec2-hp">Road Map</p>
              </div>
            </div>
            <div className="row bg-roadmap_homepage d-lg-flex d-none">
              <div className="col-xl-3 col-lg-3"></div>
              <div className="col-xl-3 col-lg-3 col-12">
                <p className="text-roadmap_header">Q2 2022</p>
                <ul>
                  <li className="text-roadmap_detail">
                    SiamCannabis.io System Completed
                  </li>
                  <li className="text-roadmap_detail">NFT Membership</li>
                  <li className="text-roadmap_detail">Marketplace</li>
                  <li className="text-roadmap_detail">CNB Tokenomics Launch</li>
                </ul>
              </div>
              <div className="col-3"></div>
              <div className="col-3 layout_roadmap-content">
                <p className="text-roadmap_header">Q4 2022</p>
                <ul>
                  <li className="text-roadmap_detail">
                    15 Rai Land Licenses Listed On SiamCannabis
                  </li>
                  <li className="text-roadmap_detail">
                    15,000 NFT on public sale
                  </li>
                  <li className="text-roadmap_detail">
                    DEX Launch (Defi) – Cannabond
                  </li>
                  <li className="text-roadmap_detail">
                    100 Online CCTV Installed
                  </li>
                  <li className="text-roadmap_detail">
                    CannaGame Launch in SiamCannabis
                  </li>
                </ul>
              </div>

              <div className="col-3 ms-xl-5 ">
                <p className="text-roadmap_header">Q1 2022</p>
                <ul>
                  <li className="text-roadmap_detail">Committee Setup</li>
                  <li className="text-roadmap_detail">
                    International Team Form
                  </li>
                  <li className="text-roadmap_detail">
                    MOU Signed with RMUTI (Licenses Approved){" "}
                  </li>
                  <li className="text-roadmap_detail">
                    SiamCannabis Team Setup
                  </li>
                  <li className="text-roadmap_detail">Whitepaper Completed</li>
                </ul>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3"></div>
              <div className="col-3">
                <p className="text-roadmap_header">Q3 2022</p>
                <ul>
                  <li className="text-roadmap_detail">
                    2 Rai Land Licenses Listed On SiamCannabis
                  </li>
                  <li className="text-roadmap_detail">
                    2,000 NFT on public sale{" "}
                  </li>
                  <li className="text-roadmap_detail">
                    20 Online CCTV Installed
                  </li>
                  <li className="text-roadmap_detail">
                    SiamCannabis Online Commerce
                  </li>
                </ul>
              </div>
            </div>
            {/* moblie roadmap  */}
            <div className="row bg-roadmap_homepage d-lg-none d-flex">
              <div className="col-6 col-xs-2 col-custom-4"></div>
              <div className="col-6 mt-3 layout-q1_roadmap col-custom-6">
                <p className="text-roadmap_header">Q1 2022</p>
                <ul>
                  <li className="text-roadmap_detail">Committee Setup</li>
                  <li className="text-roadmap_detail">
                    International Team Form
                  </li>
                  <li className="text-roadmap_detail">
                    MOU Signed with RMUTI (Licenses Approved){" "}
                  </li>
                  <li className="text-roadmap_detail">
                    SiamCannabis Team Setup
                  </li>
                  <li className="text-roadmap_detail">Whitepaper Completed</li>
                </ul>
              </div>
              <div className="col-6 layout-q2_roadmap mt-3 col-custom-100">
                <p className="text-roadmap_header">Q2 2022</p>
                <ul>
                  <li className="text-roadmap_detail">
                    SiamCannabis.io System Completed
                  </li>
                  <li className="text-roadmap_detail">NFT Membership</li>
                  <li className="text-roadmap_detail">Marketplace</li>
                  <li className="text-roadmap_detail">CNB Tokenomics Launch</li>
                </ul>
              </div>
              <div className="col-6 layout-q3_roadmap mt-3 col-custom-70">
                <p className="text-roadmap_header">Q3 2022</p>
                <ul>
                  <li className="text-roadmap_detail">
                    2 Rai Land Licenses Listed On SiamCannabis
                  </li>
                  <li className="text-roadmap_detail">
                    2,000 NFT on public sale{" "}
                  </li>
                  <li className="text-roadmap_detail">
                    20 Online CCTV Installed
                  </li>
                  <li className="text-roadmap_detail">
                    SiamCannabis Online Commerce
                  </li>
                </ul>
              </div>
              <div className="col-6 layout-q4_roadmap mt-3 col-custom-100">
                <p className="text-roadmap_header">Q4 2022</p>
                <ul>
                  <li className="text-roadmap_detail">
                    SiamCannabis.io System Completed
                  </li>
                  <li className="text-roadmap_detail">NFT Membership</li>
                  <li className="text-roadmap_detail">Marketplace</li>
                  <li className="text-roadmap_detail">CNB Tokenomics Launch</li>
                </ul>
              </div>
            </div>

            <div className="row fix-container mb-5">
              <div className="col-12">
                <p className="text-tittle_sec2-hp">FAQ</p>
              </div>
              <div className="d-lg-block d-none">
                <div className="col-12 layout_faq">
                  <div className="bg_faq">
                    <p className="text-header_faq">
                      Question 1 : How to use your NFT
                    </p>
                    <p>
                      After 6 months of membership, The system will show a
                      button “USE MY NFT”. After you use your NFT, the CNB unit
                      will be transferred to your wallet
                    </p>
                  </div>
                </div>
                <div className="col-12 layout_faq">
                  <div className="bg_faq">
                    <p className="text-header_faq">
                      Question 2 : How to resell your NFT
                    </p>
                    <p>
                      You can resell your NFT to marketplace (exchange 2 main
                      tokens including CNB and USDC). The owner can exchange
                      their NFT freely which has a 3% fee after reselling.
                    </p>
                  </div>
                </div>
                <div className="col-12 layout_faq">
                  <div className="bg_faq">
                    <p className="text-header_faq">
                      Question 3 : What are additional privileges?
                    </p>
                    <p>
                      The members who hold Siam Cannabis NFT will receive a  Gift Voucher of 5 items valued at 2,000 baht
                    </p>
                    <p>
                      (1) Receive an unlimited number of tele medicine check-ups during the treatment period
                    </p>
                    <p>
                      (2) Set of cannabis seeds and dried cannabis leaves 1 bottle
                    </p>
                    <p>
                      (3) Cannabis Oil @ Fullspectrum 1 bottle size 10 ml.
                    </p>
                    <p>
                      (4) CBD Anti-Aging Serum with CBD Facial Treatment Size 10 ml.
                    </p>
                    <p>
                      (5) CBD Sunscreen Cream Size 10 ml.
                    </p>
                  </div>
                </div>
              </div>
              {/* moblie  */}
              <div className="d-lg-none d-block layout_faq-m">
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <p className="me-3">Question 1 : How to use your NFT</p>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="detail-faq">
                        After 6 months of membership, The system will show a
                        button “USE MY NFT”. After you use your NFT, the CNB
                        unit will be transferred to your wallet
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <p className="me-3">
                        Question 2 : How to resell your NFT
                      </p>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="detail-faq">
                        You can resell your NFT to marketplace (exchange 2 main
                        tokens including CNB and USDC). The owner can exchange
                        their NFT freely which has a 3% fee after reselling. (exchange by USDC)
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>
                      <p className="me-3">
                        Question 3 : What are additional privileges?
                      </p>
                    </Accordion.Header>
                    <Accordion.Body>
                      {/* <p className="detail-faq">
                        The members who hold Siam Cannabis NFT will receive a
                        discount and privileges in purchasing goods and services
                        within the agricultural shop, Thai traditional medicine
                        clinic, and other partners in the project.
                      </p> */}
                      <p lassName="detail-faq">
                        The members who hold Siam Cannabis NFT will receive a  Gift Voucher of 5 items valued at 2,000 baht
                      </p>
                      <p lassName="detail-faq">
                        (1) Receive an unlimited number of tele medicine check-ups during the treatment period
                      </p>
                      <p lassName="detail-faq">
                        (2) Set of cannabis seeds and dried cannabis leaves 1 bottle
                      </p>
                      <p lassName="detail-faq">
                        (3) Cannabis Oil @ Fullspectrum 1 bottle size 10 ml.
                      </p>
                      <p lassName="detail-faq">
                        (4) CBD Anti-Aging Serum with CBD Facial Treatment Size 10 ml.
                      </p>
                      <p lassName="detail-faq">
                        (5) CBD Sunscreen Cream Size 10 ml.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default presalePage;
presalePage.layout = Mainlayout;
