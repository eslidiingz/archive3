import { useState } from "react";
import Link from "next/link";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import dayjs from "dayjs";

function CongratulationCoupon({ data = {}, show = false, onClose }) {
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        size="lg"
        className="layout_modal"
      >
        <Modal.Header closeButton className="mt-4">
          <Modal.Title>
            <p className="text-tittle_coupon">Congratulations!</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center">
                {/* <img
                  src="/assets/image/coupon/coupon.png"
                  className="img_coupon"
                /> */}
                <div className="row mb-3 bg_couponCon">
                  <div className="col-3">
                  </div>
                  <div className="col-9">
                    <p className="text-main_couponCon">- {data?.project?.zoneRewardRate}%</p>
                    <div className="d-flex mx-4 mb-2">
                      <p className="text-detail_couponCon w-50">{data?.project?.projectName}</p>
                      <p className="text-detail_couponCon w-50 ms-3">Zone {data?.zone + 1}</p>
                    </div>
                    <div className="d-flex mx-4 mb-3">
                      <p className="text-detail_couponCon w-50">Code : {data?.code}</p>
                      <p className="text-detail_couponCon w-50 ms-3">Exp : {dayjs(new Date(data?.expirationAt)).format('DD/MM/YYYY')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-detail_conpon mt-5">
                You have a {data?.project?.zoneRewardRate}% shopping discount on Siam Cannabis shop. 
              </p>
              <p className="text-detail_conpon">
                To use it, Please read more detail in coupon lists.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row w-100 mb-5">
            <div className="col-12 layout-btn_coupon mb-2">
              <Button onClick={onClose} className="btn-coupon">
                <p className="text-coupon_btn">Close</p>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default CongratulationCoupon;
