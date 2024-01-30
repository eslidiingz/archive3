import { useState } from "react";
import Mainlayout from "../layouts/Mainlayout";
import Link from "next/link";
import React from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const InventoryFillter = ({
  filter = {
    status: [],
    project: [],
    zone: [],
  },
  onChangeFilter,
}) => {
  // console.log({filter})
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isAll, setAll] = useState(false);
  const All = () => {
    setAll(!isAll);
  };
  const [isOn_Sell, setOn_Sell] = useState(false);
  const On_Sell = () => {
    setOn_Sell(!isOn_Sell);
  };
  const [isReady_to_use, setReady_to_use] = useState(false);
  const Ready_to_use = () => {
    setReady_to_use(!isReady_to_use);
  };
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
          <p className="m-0">Filter</p>
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
              Filter
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="row">
              <div className="col-lg-4 mb-lg-5 col-12 mb-3">
                <p className="text-menu-fillter_market">Status</p>
                <hr />
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    filter.status.find((status) => status === "all")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => onChangeFilter("status", "all")}
                >
                  All
                </button>
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    filter.status.find((status) => status === "on_sell")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => onChangeFilter("status", "on_sell")}
                >
                  On Sell
                </button>
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    filter.status.find((status) => status === "ready_to_use")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => onChangeFilter("status", "ready_to_use")}
                >
                  Ready to use
                </button>
              </div>
              <div className="col-lg-4 col-12">
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
              <div className="col-lg-4 mb-lg-5 col-12 mb-3">
                <p className="text-menu-fillter_market">Zone</p>
                <hr />
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    filter.zone.find((status) => status === 1) ? "active" : ""
                  }`}
                  onClick={() => onChangeFilter("zone", 1)}
                >
                  Zone 1
                </button>
                <button
                  className={`btn btn-filter w-100 mb-2 ${
                    filter.zone.find((status) => status === 2) ? "active" : ""
                  }`}
                  onClick={() => onChangeFilter("zone", 2)}
                >
                  Zone 2
                </button>
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
export default InventoryFillter;
InventoryFillter.layout = Mainlayout;
