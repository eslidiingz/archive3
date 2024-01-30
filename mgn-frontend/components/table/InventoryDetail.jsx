import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import InventoryFillter from "../../components/fillter/InventoryFillter";
import Link from "next/link";

const TableInventoryDetail = () => {
  let active = 2;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      <div className="layout-table_detail mt-5">
        <div className="row px-3 py-3">
          <div className="col-lg-6">
            <p className="text-tittle-table_detail">offter receticed</p>
          </div>
          <div className="col-lg-6" align="right">
            <p className="text-table-deatil">You have 8 Offcers</p>
          </div>
        </div>
        <Table striped hover responsive="md">
          <thead className="layout-header-table_detail">
            <tr>
              <th>Item</th>
              <th>Price (USDC)</th>
              <th>From</th>
              <th>Expiration</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail">
                    Cannabis Plant 1st Pre-Sell Zone 1
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <img src="/assets/image/modal/usd-coin-usdc-logo_2.svg" />
                  <p className="text-detail-table_detail ms-1">308 USDC</p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail oneline-dot">
                    0xe408...bc6c
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail oneline-dot">
                    30 AUG 2022
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex justify-content-center">
                  <button className="btn-confirm_detail">Confirm</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail">
                    Cannabis Plant 1st Pre-Sell Zone 1
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <img src="/assets/image/modal/usd-coin-usdc-logo_2.svg" />
                  <p className="text-detail-table_detail ms-1">308 USDC</p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail oneline-dot">
                    0xe408...bc6c
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail oneline-dot">
                    30 AUG 2022
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex justify-content-center">
                  <button className="btn-confirm_detail">Confirm</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail">
                    Cannabis Plant 1st Pre-Sell Zone 1
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <img src="/assets/image/modal/usd-coin-usdc-logo_2.svg" />
                  <p className="text-detail-table_detail ms-1">308 USDC</p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail oneline-dot">
                    0xe408...bc6c
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex my-2">
                  <p className="text-detail-table_detail oneline-dot">
                    30 AUG 2022
                  </p>
                </div>
              </td>
              <td>
                <div className="d-flex justify-content-center">
                  <button className="btn-confirm_detail">Confirm</button>
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default TableInventoryDetail;
TableInventoryDetail.layout = Mainlayout;
