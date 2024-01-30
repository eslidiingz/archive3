import { useState } from "react";
import Config from "../../configs/config";
import Mainlayout from "../../components/layouts/Mainlayout";
import Link from "next/link";
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "../Spinner";
import Swal from "sweetalert2";
import {
  approveUsdc,
  getIsApprove,
  approveUsdcMarket,
} from "../../models/BUSDToken";
import { cancelOrder } from "../../models/Market";
import { buyOrder } from "../../models/Market";
import { unlimitAmount } from "../../utils/misc";
import { useWalletContext } from "../../context/wallet";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { UPDATE_UNLOCK_SELL_ASSET, UPDATE_ASSET_OWNER } from "../../utils/gql/inventory";
import { UPDATE_MARKET_STATUS } from "../../utils/gql/market";
import { formatEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

function Buynow({
  data = {},
  checkIsApproveUsdc,
  preLoading = false,
  isApprove = false,
  ...props
}) {
  const router = useRouter();

  const [handleUpdateAssetOwner] = useMutation(UPDATE_ASSET_OWNER);
  const [handleUpdateSellAsset] = useMutation(UPDATE_UNLOCK_SELL_ASSET);
  const [handleUpdateMarketStatus] = useMutation(UPDATE_MARKET_STATUS);

  const { wallet } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isApprovedToken, setIsApprovedToken] = useState(isApprove);

  const handleClose = () => setShow(false);

  const handleShow = async () => {
    const res = await checkIsApproveUsdc();
    setIsApprovedToken(res);
    if (wallet) {
      setShow(true);
    } else {
      Swal.fire("Warning", "Please connect your wallet", "warning");
      setShow(false);
    }
  };

  const handleCheckApproveUSDC = async () => {
    try {
      setLoading(true);
      const res = await approveUsdcMarket();
      if (res) {
        setIsApprovedToken(true);
        Swal.fire("Success", "Approve successful.", "success");
      } else {
        Swal.fire("Warning", "Failed to approve.", "warning");
      }
    } catch (e) {
      Swal.fire("Warning", "Failed to approve.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyLand = async () => {
    try {
      setLoading(true);
      const res = await buyOrder(data.orderId);

      if (res) {

        await handleUpdateMarketStatus({ variables: { marketId: data.marketId, isActive: false } });

        await handleUpdateSellAsset({ variables: { assetId: data.assetId }});
        
        await handleUpdateAssetOwner({
          variables: {
            assetId: data.assetId,
            ownerWallet: wallet
          }
        });

        setShow(false);

        Swal.fire("Success", "Bought successfully.", "success");

        setTimeout(() => {
          router.push("/market");
        }, 2300);
        return;
      }

      Swal.fire("Warning", "Failed to buy.", "warning");
    } catch {
      Swal.fire("Warning", "Failed to buy.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const res = await cancelOrder(data.orderId);

      if (res) {

        await handleUpdateMarketStatus({ variables: { marketId: data.marketId, isActive: false } });

        await handleUpdateSellAsset({ variables: { assetId: data.assetId },
          async onCompleted(data) {
            Swal.fire("Success", "Cancel successful.", "success");
          },
          async onError(error) {
            console.error(error)
            Swal.fire("Success", "Cancel successful.", "success");
          },
        });

        setTimeout(() => {
          router.push("/market");
        }, 2300);

        return;
      }

      Swal.fire("Warning", "Failed to cancel.", "warning");
    } catch {
      Swal.fire("Warning", "Failed to cancel.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {data.owner === wallet ? (
        <Button
          variant="primary"
          onClick={handleCancelOrder}
          disabled={loading}
        >
          <p className="m-0">{loading ? <Spinner text='Cancel' /> : "Cancel"}</p>
        </Button>
      ) : (
        <Button variant="primary" onClick={handleShow} disabled={preLoading}>
          <p className="m-0">{preLoading ? <Spinner /> : props.button}</p>
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
          <Modal.Title>Buy Now</Modal.Title>
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
              <label for="LandID" className="text-tittle_modal">
                Asset ID
              </label>
              <input
                type="text"
                className="form-control layout-input_modal"
                value={data.assetToken}
                disabled={true}
              />
              <label for="CurrentPrice" className="text-tittle_modal">
                Sell Price
              </label>
              <div className="position-relative w-100 mb-3">
                <input
                  className="form-control search  layout-input-modal text-inout-modal"
                  placeholder="Sell Price"
                  value={data?.price}
                  disabled={true}
                />
                <span className="icon-search-set text-inout-modal">USDC</span>
                <img
                  src="/assets/image/modal/usd-coin-usdc-logo_2.svg"
                  className="icon-layout-L_modal"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row w-100 mb-5">
            <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal mb-2">
              <Button
                className="btn_modal-c"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                <p className="text-btn_modal-c">
                  {!loading ? "Cancel" : <Spinner />}
                </p>
              </Button>
            </div>
            {/* <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal mb-2">
                        </div>
                        <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal2 mb-2">
                        <Button className="btn_modal-bid">
                        <p className="text-btn_modal-c">Bid Offer</p>
                        </Button>
                        </div> */}

            {!isApprovedToken && (
              <div className="col-xxl-6 col-md-6 col-sm-6 col-12 mb-2 px-0 d-sm-flex justify-content-center">
                <Button className="btn_modal-s" disabled={loading}>
                  <p
                    className="text-btn_modal-c"
                    onClick={handleCheckApproveUSDC}
                  >
                    {!loading ? "Approve" : <Spinner />}
                  </p>
                </Button>
              </div>
            )}

            {isApprovedToken && (
              <div className="col-xxl-6 col-md-6 col-sm-6 col-12 mb-2 px-0 d-sm-flex justify-content-center">
                {data.owner === wallet ? (
                  <Button className="btn_modal-s" disabled={true}>
                    <p className="text-btn_modal-c">Owner</p>
                  </Button>
                ) : (
                  <Button
                    className="btn_modal-s"
                    onClick={handleBuyLand}
                    disabled={loading}
                  >
                    <p className="text-btn_modal-c">
                      {!loading ? "Buy Now" : <Spinner />}
                    </p>
                  </Button>
                )}
              </div>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Buynow;
Buynow.layout = Mainlayout;
