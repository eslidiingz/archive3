import { useState } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import Link from "next/link";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function MakeOffer(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <div className={props.ClassMain}> */}
      <Button variant="primary" onClick={handleShow}>
        <p className="m-0">{props.button}</p>
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="layout_modal"
      >
        <Modal.Header closeButton>
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
              <label for="LandID" className="text-tittle_modal">
                {props.inputName01}
              </label>
              <input
                type="text"
                className="form-control layout-input_modal"
                id=""
              />
              <label for="CurrentPrice" className="text-tittle_modal">
                {props.inputName02}
              </label>
              <div className="position-relative w-100 mb-3">
                <input
                  className="form-control search  layout-input-modal text-inout-modal"
                  placeholder={props.inputName02}
                />
                <span className="icon-search-set text-inout-modal">USDC</span>
                <img
                  src="/assets/image/modal/usd-coin-usdc-logo_2.svg"
                  className="icon-layout-L_modal"
                />
              </div>
              <label for="PriceAmount" className="text-tittle_modal">
                {props.inputName03}
              </label>
              <div className="position-relative w-100 mb-3">
                <input
                  className="form-control search  layout-input-modal text-inout-modal"
                  placeholder={props.inputName03}
                />
                <span className="icon-search-set text-inout-modal">USDC</span>
                <img
                  src="/assets/image/modal/usd-coin-usdc-logo_2.svg"
                  className="icon-layout-L_modal"
                />
              </div>
              <p className="footer-text_modal">
                You must bid highter than Lasted bid price :{" "}
                <span style={{ color: "#B56F5D" }}>308.25</span> USDC
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row w-100 mb-5">
            <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal mb-2">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="btn_modal-c"
              >
                <p className="text-btn_modal-c">Cancel</p>
              </Button>
            </div>
            <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal2">
              <Button className="btn_modal-s">
                <p className="text-btn_modal-c">Approve</p>
              </Button>
            </div>
            <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal mb-2"></div>
            <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal2 mb-2">
              <Button className="btn_modal-bid">
                <p className="text-btn_modal-c">Bid Offer</p>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default MakeOffer;
MakeOffer.layout = Mainlayout;
