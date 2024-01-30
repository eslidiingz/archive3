import { useState } from "react";
import Link from "next/link";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import dayjs from "dayjs";

function CouponDetail({ data = {}, show = false, onClose }) {
  const [activeCopyClipboard, setActiveCopyClipboard] = useState(false);
  const handleCopyClipboardCouponCode = async () => {
    navigator.clipboard.writeText(data?.code);

    setActiveCopyClipboard(true);

    setTimeout(() => {
      setActiveCopyClipboard(false)
    }, 1000);
  };
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      className="layout_modal"
    >
      <Modal.Header closeButton className="mt-3">
        <Modal.Title>
          <p className="text-tittle_coupon">Voucher Detail</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-5">
          <div className="col-lg-6 d-flex justify-content-center">
            <div className="row mb-3 bg_coupon">
              {/* <img
                src="/assets/image/coupon/coupon_bg.svg"
                className="img_coupon-detail"
              /> */}
              <div className="col-3">
              </div>
              <div className="col-9">
                <p className="text-main_coupon">- {data?.project?.zoneRewardRate}%</p>
                <div className="d-flex mx-3 mb-2">
                  <p className="text-detail_coupon w-50">{data?.project?.projectName}</p>
                  <p className="text-detail_coupon w-50 ms-3">Zone {data?.zone + 1}</p>
                </div>
                <div className="d-flex mx-3 mb-3">
                  <p className="text-detail_coupon w-50">Code : <span>{data?.code}</span></p>
                  <p className="text-detail_coupon w-50 ms-3">Exp : {dayjs(new Date(data?.expirationAt)).format('DD/MM/YYYY')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <p className="text-topic_coupon">Voucher Code</p>
            {/* <label className="text-info_coupon">{data?.code}</label> */}
            <div className="d-flex align-items-center my-2">
              <p className="btn-detail_couponTab">{data?.code}</p>
              <button className="btn-copy_couponTab" onClick={handleCopyClipboardCouponCode}>
                {activeCopyClipboard ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-topic_coupon">Coupon Detail</p>
            <p className="text_detail-coupon mb-4">
              Discount 15% for sample products.
            </p>
            <p className="text-topic_coupon">Conditions</p>
            <ul>
              <li className="text_detail-coupon">
                A discount can be restricted to one product, some products, or
                be used for all products.
              </li>
              <li className="text_detail-coupon">
                A discount can require a coupon code be entered during the
                order process (or passed in through the order process).
              </li>
              <li className="text_detail-coupon">
                A discount can also be restricted to a certain date range.
              </li>
              <li className="text_detail-coupon">
                A discount can be limited to only appear for certain link
                sources or certain order environments.
              </li>
              <li className="text_detail-coupon">
                For subscription products, a discount can be restricted to
                only the first period of the subscription (which might be used
                to offer someone a free or discounted trial of the product) or
                can be used for both the first and additional subscription
                periods.
              </li>
              <li className="text_detail-coupon">
                Limited Use Conditions include requiring a minimum order
                total, requiring a minimum number of products in the order, or
                limited a discount to only be valid once per email address.
              </li>
            </ul>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default CouponDetail;
