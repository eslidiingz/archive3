import { useState, useEffect } from "react";
import { useWalletContext } from "/context/wallet";

import Link from "next/link";
import Swal from "sweetalert2";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "../Spinner";
import { placeOrder } from "../../models/Market";
import { setApproveForMarket, getApproveForMarket } from "../../models/Land";
import { INSERT_MARKET } from "../../utils/gql/market";
import { UPDATE_SELL_ASSET } from "../../utils/gql/inventory";
import { useMutation } from "@apollo/client";
import { web3Modal } from "../../utils/providers/connector";
import dayjs from "dayjs";

function Sell({ data, handleFetchInventoryItem, ...props }) {
  const { wallet } = useWalletContext();

  const [loading, setLoading] = useState(false);
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  const [show, setShow] = useState(false);
  const [enteredSellPrice, setEnteredSellPrice] = useState("");

  const [handleInsertMarket] = useMutation(INSERT_MARKET);
  const [handleUpdateAsset] = useMutation(UPDATE_SELL_ASSET);

  const handleClose = () => setShow(false);

  const handleShow = async () => {
    const approved = await handleCheckApproveForAll();
    setIsApprovedForAll(approved);
    setShow(true);
  };

  const handleChangeSellPrice = (e) => {
    setEnteredSellPrice(e.target.value);
  };

  const handleSellInventoryItem = async () => {
    try {
      setLoading(true);

      if (wallet) {
        let sellPrice = parseInt(enteredSellPrice);
        sellPrice = isNaN(sellPrice) ? 0 : sellPrice;

        if (sellPrice < 1) {
          return Swal.fire("Warning", "Please enter sell price.", "warning");
        }
        const result = await placeOrder(data?.assetToken, sellPrice.toString());
        console.log(result, "handleSellInventoryItem");
        const today = dayjs().format("YYYY-MM-DD HH:mm:ss");

        await handleInsertMarket({
          variables: {
            objects: {
              created_at: today,
              is_active: true,
              order_id: result[0].orderId,
              price: sellPrice,
              project_id: data?.projectId,
              seller_wallet: wallet,
              token_id: data?.assetToken,
              updated_at: today,
              zone_id: data?.zone,
            },
          },
          async onError(error) {
            console.error(error);
          },
        });

        await handleUpdateAsset({
          variables: {
            assetId: data?.id,
          },
          async onError(error) {
            console.error(error);
          },
        });

        if (result?.length > 0) {
          Swal.fire("Success", "Placement successful.", "success");
          handleClose();
          await handleFetchInventoryItem();
        } else {
          Swal.fire("Warning", "Failed to sell.", "warning");
        }
      } else {
        if (typeof window.ethereum === "undefined") {
          Swal.fire("Warning", "Please, Install metamask wallet", "warning");
        } else {
          const _web3Modal = web3Modal();
          await _web3Modal.connect();
        }
      }
    } catch (e) {
      Swal.fire("Warning", "Failed to sell.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveForAll = async () => {
    try {
      setLoading(true);

      const isApprovedForAllItem = await setApproveForMarket();

      setIsApprovedForAll(isApprovedForAllItem ? true : false);

      return isApprovedForAllItem ? true : false;
    } catch (e) {
      setIsApprovedForAll(false);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckApproveForAll = async () => {
    try {
      setLoading(true);
      let isApprovedForAll = await getApproveForMarket(wallet);

      console.log({ isApprovedForAll });

      return isApprovedForAll ? true : false;
    } catch (e) {
      console.error(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // const initialize = async () => {
  //     try{
  //         setIsApprovedForAll(await handleCheckApproveForAll());
  //     }catch{

  //     }
  // };

  // useEffect(() => {

  //     let mounted = true;

  //     if(mounted) initialize();

  //     return () => {
  //         mounted = false;
  //     }

  // }, []);

  return (
    <>
      {data.isLocked ? (
        <Link href={`/inventory/detail/${data?.assetToken}`}>
          <Button
            className="btn-on-selling btn btn-detail_market w-100"
            variant="primary"
          >
            <p className="m-0">Selling on Market</p>
          </Button>
        </Link>
      ) : (
        <Button
          className="btn-sell btn btn-detail_market w-100"
          variant="primary"
          onClick={handleShow}
        >
          <p className="m-0">Sell</p>
        </Button>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="layout_modal"
      >
        <Modal.Header closeButton={!loading}>
          <Modal.Title>Sell</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-5 col-12">
              <div className="layout-modal-img">
                <img
                  src="/assets/image/card/cannabis.webp"
                  className="img-modal"
                />
              </div>
            </div>
            <div className="col-lg-7 col-12">
              <div>
                <label className="text-tittle_modal">
                  Project : {data?.projectId + 1}
                </label>
              </div>
              <div>
                <label className="text-tittle_modal">
                  Zone : {data?.zone + 1}
                </label>
              </div>
              <div>
                <label className="text-tittle_modal">
                  Token ID : {data?.assetToken}
                </label>
              </div>
              <label className="text-tittle_modal">Sell Price</label>
              <div className="position-relative w-100">
                <input
                  className="form-control search  layout-input-modal text-inout-modal"
                  placeholder="Sell Price"
                  value={enteredSellPrice}
                  onChange={handleChangeSellPrice}
                  disabled={loading || !isApprovedForAll}
                />
                <span className="icon-search-set text-inout-modal">USDC</span>
                <img
                  src="/assets/image/modal/usd-coin-usdc-logo_2.svg"
                  className="icon-layout-L_modal"
                />
              </div>
              <p className="mt-3">* Transaction fee 3% after transaction successful.</p>
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
                disabled={loading}
              >
                {loading ? (
                  <Spinner text='Cancel'/>
                ) : (
                  <p className="text-btn_modal-c">Cancel</p>
                )}
              </Button>
            </div>
            <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal2">
              <Button
                className="btn_modal-s"
                onClick={
                  isApprovedForAll
                    ? handleSellInventoryItem
                    : handleApproveForAll
                }
                disabled={loading}
              >
                {loading ? (
                  <Spinner text='Sell'/>
                ) : (
                  <p className="text-btn_modal-c">
                    {isApprovedForAll ? "Sell" : "Approve"}
                  </p>
                )}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Sell;
