import Head from "next/head";
import Image from "next/image";
import { Router, useRouter } from "next/router";

import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

export default function FaitQR() {
  const { query } = useRouter();

  const [loading, setLoading] = useState(false);
  const [qr, setQR] = useState({
    expiredate: "",
    image: "",
    orderNo: "",
    orderdatetime: "",
    referenceNo: "",
    total: "1",
  });
  const [form, setForm] = useState({
    merchantid: "13934739",
    refno: "",
    customeremail: "",
    cc: "00",
    productdetail: "Velaverse LAND",
    total: "",
    name: "",
    walletaddress: "",
    // ถ้าส่ง postbackurl เขาจะส่สงมาเป็น GET และไม่มีค่าส่งมา
    // postbackurl: "https://mip-pay-solution-qwh6hk63r-leeoong.vercel.app/api/webhook?refno=100000000001",
    // returnurl: "https://leeoong.com",
  });

  const oForm = useRef(null);
  const handleFormSubmit = () => {
    oForm.current.submit();
  };

  const QRcodeImageSRC = async () => {
    if (form.total) {
      let request = {
        merchantID: form.merchantid,
        productDetail: form.productdetail,
        customerEmail: form.customeremail,
        customerName: form.name,
        total: form.total.toFixed(2), // ต้องมีทศนิยมสองจุดเสมอ
        referenceNo: form.refno,
      };

      let { data } = await axios
        .post("https://apis.paysolutions.asia/tep/api/v1/promptpay", request, {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQ1M2UxZWVlODQ5OWQyZjdkNzA4YzYzY2Q1ZmMwNjhlZGVkMGVhMDc5ZTc1MTFlY2M1OTA5MjMzMzI3NWExZGRlMzBlMTVhYTE0Mzc4ZjFkIn0.eyJhdWQiOiIyIiwianRpIjoiNDUzZTFlZWU4NDk5ZDJmN2Q3MDhjNjNjZDVmYzA2OGVkZWQwZWEwNzllNzUxMWVjYzU5MDkyMzMzMjc1YTFkZGUzMGUxNWFhMTQzNzhmMWQiLCJpYXQiOjE2NDIwNDA0ODYsIm5iZiI6MTY0MjA0MDQ4NiwiZXhwIjoxNzk5ODA2ODg2LCJzdWIiOiIxMzkzNDczOSIsInNjb3BlcyI6W119.PT4z2Tii9rNttFlcmHEbvARbVC5sPD-4oe_2uykqNvcUekJmNsbRTLyUuOxGf4zVA3nXpYY9zh5Yia1z_0ca5L0J2PBcRkuzIaTnLYnY8RYmcSwwiRWh15NJ2ZjIUO091zt0NnQC_t54HiM_VOjuiazLmUaVEdtSxOCkPyikwXktHqHLc4O2v1GZMcIz39a88RP2WitWVM3pglIDaZSMW4Tt3I1C7KDMpe50vKGXCPiCOZJfuoLO5ZU7xR09GT4AwLL9O-9-w6i8YwCvK1ZFYJuusC5b-iWIe8BpzMytoykXnzX88oO4nQYh9rBtWIXRgnyFDM8vRU5FGxOapni7nZg1oCVMtalvutHhaoi-ffBF_exk5_AIglaZz40Tst0uULIFD-6xxAEtYkuFcD7mH_lK0puDTIz-H6fA1T2wxjXRVMAi3rOq0AqCdxn4aJhZoka8R5MqNq5VWmZQn67zDKDDceigyOTQ6uOc05_1f1hJBZXe31vB8CU8zUN0pkjln5iZCUQHKV0IjZDwDFVQHmK0UqArTBPtc_Pedte-zJTsWgE-QueXB98hmxa2QA09AKlysv9O4CdGrIKXxvkBAzOA-Y9UOWeiUQKM0wJXeHJWe-LonLT9W9GylWmVDyehoR6fXpVYZLH0ggdoNCHGRj36mUQWz5jvCr4BTSoZqG4",
          },
        })
        .catch((error) => {
          console.log(error);
        });

      if (data.status === "success") {
        setQR({ image: data.data.image });
      } else {
        console.table(data.error.data);
      }
    }
  };

  const getSession = async (refno) => {
    setLoading(true);
    let host =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");

    let url = host + "/api/get-session";

    let { data } = await axios
      .post(url, {
        refno: refno,
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    setForm((prevState) => ({
      ...prevState,
      refno: refno,
      walletaddress: data.walletaddress,
      customeremail: data.email,
      name: data.name,
      amount: data.amount,
      total: data.total,
    }));

    setLoading(false);
  };

  useEffect(() => {
    if (query.ref) {
      getSession(query.ref);
    }
    // QRcodeImageSRC(qr, setQR);
  }, [query]);

  useEffect(() => {
    QRcodeImageSRC();
  }, [form]);

  const handleFormChange = (event) => {
    setForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleQRChange = (event) => {
    setQR((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <div className="text-white">พร้อมเพย์ QR Code</div>

      <div className="container">
        <div className="row">
          <div className="col-8">
            <div className="accordion mt-3 mb-3" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  ></button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    {/* <button onClick={() => { QRcodeImageSRC(qr,setQR) }} type="button" className="btn btn-primary">สร้าง QR CODE</button> */}
                    <img src={qr.image} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card mt-3">
              <div className="card-header">ข้อมูลการชำระเงิน</div>
              <div className="card-body text-white">
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">เลขที่คำสั่งซื้อ</label>
                    <div>{form.refno}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">E-mail address</label>
                    <div>{form.customeremail}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">wallet address</label>
                    <div>{form.walletaddress}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">ชื่อ - สกุล</label>
                    <div>{form.name}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">รายละเอียดสินค้า</label>
                    <div>{form.name}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">จำนวน</label>
                    <div>{form.amount}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">ยอดเงินที่ต้องทำระ</label>
                    <div>{form.total} บาท</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
