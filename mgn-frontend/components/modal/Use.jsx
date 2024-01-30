import React from "react";
import { useState, memo } from "react";
import dayjs from "dayjs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "../Spinner";
import { getApproveForCalim, setApproveForClaim, getZoneInfo } from "../../models/Land";
import { callClaimLand } from "../../models/Claim";
import { useWalletContext } from "../../context/wallet";
import Swal from "sweetalert2";
import { useMutation, useLazyQuery } from "@apollo/client";
import { UPDATE_CLAIM_ASSET } from "../../utils/gql/inventory";
import { INSERT_VOUHER } from "../../utils/gql/voucher";
import { generateVoucherCode } from "../../utils/misc";



function Use({ data = {}, handleFetchInventoryItem, handleShowCongratulationCoupon, disabled, ...props }) {
  console.log({data})
  const { wallet } = useWalletContext();

  const [handleUpdateClaimAsset] = useMutation(UPDATE_CLAIM_ASSET);
  const [handleInsertVoucher] = useMutation(INSERT_VOUHER);
  
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  const [assetDetail, setAssetDetail] = useState({});

  const handleClose = () => setShow(false);

  const handleShow = async () => {
    try{
      setLoading(true);
      const zoneInfo = await getZoneInfo(data?.projectId, data?.zone);
      // console.log({zoneInfo})
      setAssetDetail(zoneInfo);
      await handleCheckApproveForAll();
    }catch{}finally{
      setLoading(false);
      setShow(true);
    }
  };

  const handleCheckApproveForAll = async () => {
    try {
      setLoading(true);
      const isApprove = await getApproveForCalim(wallet);
      console.log({isApprove})
      setIsApprovedForAll(isApprove);
    } catch {
      setIsApprovedForAll(false);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveForAll = async () => {
    try {
      setLoading(true);
      const res = await setApproveForClaim();
      setIsApprovedForAll(res);
    } catch {
      setIsApprovedForAll(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClaimLand = async () => {
    await handleFetchInventoryItem();
    setShow(false);
  };

  const handleMappingVoucherObject = async ({transactionHash, tokenId, projectId, zoneId, voucherCode}) => {
    try{
      return {
        claim_tx_hash: transactionHash, 
        code: voucherCode, 
        wallet_address: wallet, 
        zone_id: zoneId,
        project_id: projectId, 
        token_id: tokenId,
        note: 'Claim',
        expiration_at: dayjs().add(30, 'day').format("YYYY-MM-DD HH:mm:ss"), 
        is_used: false, 
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
    }catch{
      return {};
    }
  };

  const handleClaimLand = async (tokenId, projectId, zoneId, assetId) => {
    try {
      setLoading(true);

      const claim = await callClaimLand(tokenId);
      if (claim) {
        await handleUpdateClaimAsset({ variables: { assetId, isClaim: true },
          async onCompleted() {
            const voucherCode = await generateVoucherCode({tokenId,projectId,zoneId});

            const transactionHash = claim.transactionHash || '';
    
            const mappedVoucherObject = await handleMappingVoucherObject({transactionHash, tokenId, projectId, zoneId, voucherCode});
            await handleInsertVoucher({
              variables: { object: mappedVoucherObject },
              async onCompleted(data) {
                await handleSuccessClaimLand();
                await handleShowCongratulationCoupon(data.insert_vouchers_one.id);
              },
              async onError(error) {
                console.error(error)
                await handleSuccessClaimLand();
                await handleShowCongratulationCoupon();
              },
            });
          },
          async onError(error) {
            Swal.fire("Warning", "Failed to use.", "warning");
            await handleSuccessClaimLand();
            console.error(error)
          },
         });
       
      } else {
        Swal.fire("Warning", "Failed to use.", "warning");
      }
    } catch (e) {
      console.error(e)
      Swal.fire("Warning", "Failed to use.", "warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="btn-time btn btn-detail_market w-100"
        variant="primary"
        disabled={disabled || data.isLocked}
        onClick={handleShow}
      >
        <p className="m-0">{props.button}</p>
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="layout_modal"
      >
        <Modal.Header closeButton={disabled || loading ? false : true}>
          <Modal.Title>Use</Modal.Title>
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
              <p className="text-deatil-main_modal">Your Plant is grown up!</p>
              {/* <p className="text-deatil-sub_modal">
                Your cannabis plant is fully grown and can be use to increase
                price Get more 15% of the value and sell it back to us with CNB
                tokens.
              </p> */}
              <div className="my-3">
                <p className="text-deatil-sub_modal">
                  Project : {data?.projectId + 1}
                </p>
                <p className="text-deatil-sub_modal">
                  Zone : {data?.zone + 1}
                </p>
                <p className="text-deatil-sub_modal">
                  Token ID : {data?.assetToken}
                </p>
              </div>
              <label htmlFor="CurrentPrice" className="text-tittle_modal">
                {props.inputName02}
              </label>
              <div className="position-relative w-100 mb-3">
                <input
                  className="form-control search  layout-input-modal text-inout-modal"
                  placeholder={props.inputName02}
                  value={parseInt(data?.project?.price || 0)}
                  disabled={true}
                />
                <span className="icon-search-set text-inout-modal">USDC</span>
                <img
                  src="/assets/image/modal/usd-coin-usdc-logo_2.svg"
                  className="icon-layout-L_modal"
                />
              </div>
              <label htmlFor="CurrentPrice" className="text-tittle_modal">
                {props.inputName03}
              </label>
              <div className="position-relative w-100">
                <input
                  className="form-control search  layout-input-modal text-inout-modal"
                  placeholder={props.inputName03}
                  value={((data?.project?.zoneRewardRate / 100) * data?.project?.price) + data?.project?.price}
                  disabled={true}
                />
                <span className="icon-search-set text-inout-modal">CNB</span>
                <img
                  src="/assets/image/modal/Group_81.svg"
                  className="icon-layout-L_modal"
                />
              </div>
              <p className="text-price_modal-user">{props.TextPriceuser}</p>
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
                disabled={disabled || loading}
              >
                <p className="text-btn_modal-c">
                  {disabled || loading ? <Spinner /> : "Cancel"}
                </p>
              </Button>
            </div>

            {isApprovedForAll && (
              <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal2">
                <Button
                  className="btn_modal-s"
                  onClick={() =>
                    handleClaimLand(data.assetToken, data.projectId, data.zone, data.id)
                  }
                  disabled={disabled || loading}
                >
                  <p className="text-btn_modal-c">
                    {disabled || loading ? <Spinner /> : "Claim"}
                  </p>
                </Button>
              </div>
            )} 

            {!isApprovedForAll && (
              <div className="col-xxl-6 col-md-6 col-12 layout-btn_modal2">
                <Button
                  className="btn_modal-s"
                  onClick={() => handleApproveForAll()}
                  disabled={loading}
                >
                  <p className="text-btn_modal-c">
                    {loading ? <Spinner /> : "Approve"}
                  </p>
                </Button>
              </div>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default memo(Use);
