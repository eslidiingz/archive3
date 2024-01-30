import { useState } from "react";
import Link from "next/link";
import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import CouponDetail from "../modal/CouponDetail";

function Coupon(props) {

//   var copyText = document.getElementById("myInput");
//   copyText.select();
//   copyText.setSelectionRange(0, 99999);
//   navigator.clipboard.writeText(copyText.value);
//   alert("Copied the text: " + copyText.value);

  return (
    <>
        <div className="layoutmain_CouponTab">
        <Tabs
        defaultActiveKey="Assets"
        id="uncontrolled-tab-example"
        className="mb-3"
        >
            <Tab eventKey="Assets" title="Assets">

            </Tab>
            <Tab eventKey="Coupon" title="Coupon">
                <div className="test">
                <Table striped>
                <thead>
                <tr>
                    <th className="text-topic_couponTab" width="180px">Project</th>
                    <th className="text-topic_couponTab" width="150px">Zone</th>
                    <th className="text-topic_couponTab" width="200px">Genarate Date</th>
                    <th className="text-topic_couponTab" width="200px">Expiration Date</th>
                    <th className="text-topic_couponTab" width="200px">Coupon Code</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="d-flex align-items-center text-detail_couponTab">
                                <CouponDetail/>
                            </div>
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <p className="text-detail_couponTab">Zone 1</p>
                            </div>
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <p className="text-detail_couponTab">xx/xx/xxxx</p>
                            </div>
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <p className="text-detail_couponTab">xx/xx/xxxx</p>
                            </div>
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <p className="btn-detail_couponTab">CC0001</p>
                                <button className="btn-copy_couponTab" onClick={() => navigator.clipboard.writeText("CC0001")}>
                                    Copy
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>
                </div>
            
            </Tab>
        </Tabs>
        </div>
    </>
        );
      };
      export default Coupon;