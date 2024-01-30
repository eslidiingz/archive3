import { useState } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import Link from "next/link";
import React from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const MarketFillter = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isProject, setProject] = useState(false);
  const Project = () => {
    setProject(!isProject);
  };
  const [isZone_1, setZone_1] = useState(false);
  const Zone_1 = () => {
    setZone_1(!isZone_1);
  };
  const [isZone_2, setZone_2] = useState(false);
  const Zone_2 = () => {
    setZone_2(!isZone_2);
  };

  return (
    <>
      <div className="layout-main_market">
        <Button onClick={handleShow} className="layout-btn_market">
          <img
            src="/assets/image/market/fi-rr-apps-sort.svg"
            className="me-3"
          />{" "}
          <p className="m-0">Fillter</p>
        </Button>
        <Offcanvas
          width={300}
          show={show}
          placement="top"
          onHide={handleClose}
          className="layout-page-fillter_market"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-pagrfillter-tittle_market">
              Fillter
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="row">
              <div className="col-xxl-3 col-lg-6 col-12">
                <p className="text-menu-fillter_market">Project</p>
                <hr />
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    isProject ? "active" : ""
                  }`}
                  onClick={Project}
                >
                  {" "}
                  <img
                    src="/assets/image/market/ethereum_1.svg"
                    className={`me-3 icon-filter_market ${
                      isProject ? "active" : ""
                    }`}
                  />{" "}
                  1st Pre-sell
                </button>
              </div>
              <div className="col-xxl-3 col-lg-6 col-12 mb-3">
                <p className="text-menu-fillter_market">Zone</p>
                <hr />
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    isZone_1 ? "active" : ""
                  }`}
                  onClick={Zone_1}
                >
                  Zone 1
                </button>
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    isZone_2 ? "active" : ""
                  }`}
                  onClick={Zone_2}
                >
                  Zone 2
                </button>
              </div>
              <div className="col-xxl-3 col-lg-6 col-12 mb-3">
                <div className="row">
                  <div className="col-xxl-6 col-6">
                    <p className="text-menu-fillter_market">Price</p>
                  </div>
                  <div className="col-xxl-6 col-6" align="right">
                    <p className="text-menu2-fillter_market">ETH</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xxl-6 col-sm-6 col-12 mb-2">
                    <input
                      type="number"
                      className="form-control"
                      id=""
                      placeholder="Min"
                    />
                  </div>
                  <div className="col-xxl-6 col-sm-6 col-12">
                    <input
                      type="number"
                      className="form-control"
                      id=""
                      placeholder="Mix"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-lg-6 col-12 mb-3">
                <div className="col-12">
                  <p className="text-menu-fillter_market">Date</p>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xxl-6 col-sm-6 col-12 mb-2">
                    <input
                      type="date"
                      className="layout-date"
                      onkeydown="return false"
                    />
                  </div>
                  <div className="col-xxl-6 col-sm-6 col-12">
                    <input
                      type="date"
                      className="layout-date"
                      onkeydown="return false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};
function Example() {
  return (
    <>
      {["top"].map((placement, idx) => (
        <OffCanvasExample key={idx} placement={placement} name={placement} />
      ))}
    </>
  );
}
export default MarketFillter;
MarketFillter.layout = Mainlayout;
