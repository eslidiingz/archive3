import Modal from "react-bootstrap/Modal";
import Link from "next/link";
import React from "react";
import Button from "react-bootstrap/Button";
import SpinnerNumber from "../fillter/SpinnerNumber";
import Spinner from "../Spinner";

function OnBuy({ projectDetal, disabledButton = false, ...props }) {
  return (
    <>
      <div className="layout-main_modal">
        <Modal
          show={props.show}
          onHide={props.onClose}
          backdrop="static"
          keyboard={false}
          size="lg"
          className="layout_modal"
        >
          <Modal.Header closeButton={!disabledButton}>
            <Modal.Title>{props.tittle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-5 col-12">
                <div className="layout-modal-img">
                  <img src={props.img} className="img-modal" />
                </div>
              </div>
              <div className="col-lg-7 col-12">
                {/* <div>
                  <ul className="frame-ul">
                    <li>
                      <div className="frame-li">
                        <div className="frame-img-li">
                          <img
                            src="..//assets/image/modal/012-project1.svg"
                            className="w-100"
                          />
                        </div>
                        <p className="fw-bolder">Pre-Sell</p>
                      </div>
                    </li>
                    <li>
                      <i className="fas fa-angle-right mt-3"></i>
                    </li>
                    <li>
                      <div className="frame-li">
                        <div className="frame-img-li">
                          <img
                            src="..//assets/image/project/greenhouse1.webp"
                            className="w-100"
                          />
                        </div>
                        <p className="fw-bolder">Zone {props.zone + 1}</p>
                      </div>
                    </li>
                    <li>
                      <i className="fas fa-angle-right mt-3"></i>
                    </li>
                    <li>
                      <div className="frame-li">
                        <div className="frame-img-li">
                          <img
                            src="..//assets/image/project/PotCannabis 3.webp"
                            className="w-100"
                          />
                        </div>
                        <p className="fw-bolder">Asset</p>
                      </div>
                    </li>
                  </ul>
                </div> */}
                <p className="ci-color-brown">Amount to buy</p>
                <div className="input-group input-spinner w-100">
                  <SpinnerNumber
                    setInfoInputAmount={props.setInfoInputAmount}
                    handleChangeTotalPrice={props.handleChangeTotalPrice}
                    disabled={disabledButton}
                  />
                </div>
                <p className="ci-color-brown">Total Price</p>
                <h3 className="ci-color-green">{props.totalAmount} USDC</h3>
                <div className="row mb-5 px-0">
                  {!props.isApprove && (
                    <div className="col-xxl-6 col-md-6 col-sm-6 col-12 mb-2 px-0 d-sm-flex justify-content-center">
                      <Button
                        className="btn_modal-s"
                        disabled={disabledButton}
                        onClick={props.approveUsdc}
                      >
                        <p className="text-btn_modal-c">
                          {!disabledButton ? "Approve" : <Spinner text='Approve' />}
                        </p>
                      </Button>
                    </div>
                  )}

                  {props.isApprove && (
                    <div className="col-xxl-6 col-md-6 col-sm-6 col-12 mb-2 p-0 d-sm-flex justify-content-center">
                      <Button
                        className="btn_modal-s"
                        onClick={props.handleBuyLand}
                        disabled={disabledButton}
                      >
                        <p className="text-btn_modal-c">
                          {!disabledButton ? "Buy" : <Spinner text='Buy' />}
                        </p>
                      </Button>
                    </div>
                  )}

                  <div className="col-xxl-6 col-md-6 col-sm-6 col-12 mb-2 p-0 d-sm-flex justify-content-center">
                    <Button
                      variant="secondary"
                      className="btn_modal-c"
                      disabled={disabledButton}
                      onClick={props.onClose}
                    >
                      <p className="text-btn_modal-c">
                        {!disabledButton ? "Cancel" : <Spinner text='Cancel' />}
                      </p>
                    </Button>
                  </div>
                  <div className="col-12 px-0 my-2">
                    <div className="img-inven">
                      <p className="ci-color-brown">Project Detail</p>
                      <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Project Name</p>
                        <p className="ci-color-green mb-2">
                          {projectDetal.projectName}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Zone</p>
                        <p className="ci-color-green mb-2">
                          Zone {props.zone + 1}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Open for-Sell</p>
                        <p className="ci-color-green mb-2">
                          {projectDetal.openPreSell}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Start planting</p>
                        <p className="ci-color-green mb-2">
                          {projectDetal.startPlanting}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Planting Time</p>
                        <p className="ci-color-green mb-2">
                          +{projectDetal.platingDuration} Days
                        </p>
                      </div>
                      {/* <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Date to use</p>
                        <p className="ci-color-green mb-2">
                          {projectDetal.readyToUseAt}
                        </p>
                      </div> */}
                      <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder mb-2">Price</p>
                        <p className="ci-color-green mb-2">
                          {projectDetal.price} USDC
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 px-0 my-2">
                    <div className="img-inven">
                      {/* <p className="ci-color-brown">Asset Detail</p> */}
                      <p className="ci-color-brown">NFT Privileges</p>
                      <p>
                        Cannabis is growing We are growing cannabis plants for
                        you. It take time 180 days from the start of planting.
                        When it's over, you can Use to increase the price by
                        15%.
                      </p>
                      {/* <div className="d-flex justify-content-between ">
                        <p className=" fw-bolder">Zone {props.zone + 1}</p>
                      </div> */}
                    </div>
                  </div>
                  <div className="col-12 px-0 my-2">
                    <div className="img-inven">
                      <p className="ci-color-brown">Clinic Voucher Privileges</p>
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
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
export default OnBuy;
