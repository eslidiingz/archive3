import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Config from "../../../configs/config";

import Link from "next/link";
import Mainlayout from "../../../components/layouts/Mainlayout";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import InventoryFillter from "../../../components/fillter/InventoryFillter";
import TableInventoryDetail from "../../../components/table/InventoryDetail";
import Spinner from "../../../components/Spinner";
import Swal from "sweetalert2";

import { getLandDetailByTokenId } from "../../../models/Land";
import { cancelOrder } from "../../../models/Market";
import { useWalletContext } from "../../../context/wallet";
import { GET_ASSET_BY_TOKEN_ID, UPDATE_UNLOCK_SELL_ASSET } from "../../../utils/gql/inventory";
import { UPDATE_MARKET_STATUS, GET_LATEST_MARKET_BY_TOKEN_ID } from "../../../utils/gql/market";


import { useLazyQuery, useMutation } from "@apollo/client";

const InventoryDetail = () => {
  const { wallet } = useWalletContext();

  const router = useRouter();

  const [handleFetchAssetByTokenId] = useLazyQuery(GET_ASSET_BY_TOKEN_ID);
  const [handleUpdateSellAsset] = useMutation(UPDATE_UNLOCK_SELL_ASSET);
  const [handleUpdateMarketStatus] = useMutation(UPDATE_MARKET_STATUS);
  const [handleFetchLatestMarketOrderByTokenId] = useLazyQuery(GET_LATEST_MARKET_BY_TOKEN_ID);

  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [landDetail, setLandDetail] = useState({asset: {}, market: {}});

  // let active = 2;
  // let items = [];
  // for (let number = 1; number <= 5; number++) {
  //   items.push(
  //     <Pagination.Item key={number} active={number === active}>
  //       {number}
  //     </Pagination.Item>
  //   );
  // }

  const handleFetchInventoryDetail = async () => {
    try{
      setLoadingContent(true);

      const responseAsset = await handleFetchAssetByTokenId({ variables: { tokenId: router.query.tokenId }});
      const responseLatestMarket = await handleFetchLatestMarketOrderByTokenId({ variables: { tokenId: router.query.tokenId }});
   
      setLandDetail({asset: responseAsset.data.assets[0], market: responseLatestMarket.data.markets[0]});

    }catch{
      setLandDetail({});
    }finally{
      setLoadingContent(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);

      const res = await cancelOrder(parseInt(landDetail.market.orderId));

      if (res) {
        await handleUpdateSellAsset({ variables: { assetId: landDetail.asset.id },
          async onCompleted() {
            await handleUpdateMarketStatus({ variables: { marketId: landDetail.market.id}});

            Swal.fire("Success", "Canceled successfully.", "success");
          },
          async onError(error) {
            console.error(error)
            Swal.fire("Success", "Canceled successfully.", "success");
          },
        })

        setTimeout(() => {
          router.push("/inventory");
        }, 2300);

        return;
      }

      Swal.fire("Warning", "Failed to cancel.", "warning");
    } catch (e){
      console.error(e.message)
      Swal.fire("Warning", "Failed to cancel.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const initialize = async () => {
    await handleFetchInventoryDetail();
  };

  useEffect(() => {
    let mounted = true;

    if (mounted && router.isReady) initialize();

    return () => {
      mounted = false;
    }

  }, [router.isReady]);

  return (
    <>
      <scetion className="py-5 detail-inventory layout_detailpage" id="body">
        <div className="container fix-container my-5">
          <div className="row layout_detailpage">
            <div className="col-12 layout-detail_nav mb-3">
              <Link href={"/inventory"}>
                <p className="nav_detail me-2">Inventory</p>
              </Link>
              <i className="fas fa-circle icon-nav_detail mx-2"></i>
              <Link href={""}>
                <p className="nav_detail ms-2">Inventory Detail</p>
              </Link>
            </div>
            {/* <div className="col-lg-6 col-12 d-flex" align="right">
                    <div className="position-relative w-100 mx-lg-4 me-3">
                        <input className="form-control search  input-search-set" placeholder="Search" />
                    <i className="fas fa-search icon-search-set"></i>
                    </div>
                    <InventoryFillter/>
                </div>   */}
          </div>
        </div>
        <div className="container fix-container my-5">
            {loadingContent ? (
              <div className="row layout-content_detail">
                  <Spinner showText={false} size={'lg'} />
              </div>
            ) : (
            <div className="row layout-content_detail">
            {wallet === landDetail?.asset?.ownerAddress ? (
              <>
                <div className="col-xxl-3 col-lg-3 col-12">
                  <img src="/assets/image/card/cannabis.webp" className="w-100" />
                </div>
                <div className="col-xxl-9 col-lg-9 col-12 mt-4">
                  {/* <p className="text-brown_detail">Asset Name</p> */}
                  <p className="text-content-tittle_detail">{landDetail?.asset?.project?.projectName}</p>
                  <hr />
                  <p className="text-brown_detail">Selling Price</p>
                  <div className="d-flex my-2">
                    <img src="/assets/image/modal/usd-coin-usdc-logo_2.svg" />
                    <p className="text-price_detail">
                      {!loadingContent && (landDetail?.market ? landDetail?.market?.price : landDetail?.asset?.project?.price)} <span className="text-black_detail">USDC</span>
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <p className="text-brown_detail my-1">Status :</p>
                    </div>
                    <div className="col-lg-9">
                      <div className="row">
                      {!loadingContent && (
                        landDetail?.asset?.isLocked ? (
                          <div className="col-2 my-1 d-flex layout-status_detail me-2">
                            <i className="fas fa-circle icon-nav-green_detail me-2"></i>
                            <p className="text-green_detail">On Sell</p>
                          </div>
                        ) : (
                          <div className="col-2 my-1 d-flex layout-status_detail">
                            <i className="fas fa-circle icon-nav_detail me-2"></i>
                            <p className="text-brown_detail2">On Hold</p>
                          </div>
                        )
                      )}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <p className="text-brown_detail my-1 mb-2">
                        Contract Address :
                      </p>
                    </div>
                    <div className="col-lg-9">
                      <p className="text-black_detail my-1">
                        {!loadingContent && Config.LAND_CA}
                      </p>
                    </div>
                    <div className="col-lg-3">
                      <p className="text-brown_detail my-1">Owner Address :</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="text-black_detail my-1">
                        {!loadingContent && landDetail?.asset?.ownerAddress}
                      </p>
                    </div>
                    <div className="col-lg-3">
                      <p className="text-brown_detail my-1">Project :</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="text-black_detail my-1">{landDetail?.asset?.projectId + 1}</p>
                    </div>
                    <div className="col-lg-3">
                      <p className="text-brown_detail my-1">Zone :</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="text-black_detail my-1">{landDetail?.asset?.zone + 1}</p>
                    </div>
                    <div className="col-lg-3">
                      <p className="text-brown_detail my-1">Token ID :</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="text-black_detail my-1">{landDetail?.asset?.assetToken}</p>
                    </div>
                  </div>

                  <div className="my-2">
                    <button className="btn-cancle_detail" onClick={handleCancelOrder} disabled={loading}>{loading ? <Spinner text='Cancel Sell' /> : 'Cancel Sell'}</button>
                    {/* <button className="btn-brown_detail">Hold this Sell</button> */}
                  </div>
                  {/* <TableInventoryDetail /> */}
                </div>
              </>
              ) : (
                <h3 className="my-4 text-center">You don't use the owner.</h3>
              )}
            </div>

            )}
        </div>
      </scetion>
    </>
  );
};

export default InventoryDetail;
InventoryDetail.layout = Mainlayout;
