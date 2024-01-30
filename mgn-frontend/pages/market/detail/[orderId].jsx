import Mainlayout from "../../../components/layouts/Mainlayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import Swal from "sweetalert2";
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import MarketFillter from "../../../components/fillter/MarketFillter";
import Link from "next/link";
import TableMarketDetail from "../../../components/table/MarketDetail";
import MakeOffer from "../../../components/modal/MakeOffer";
import Buynow from "../../../components/modal/Buynow";
import { useWalletContext } from "../../../context/wallet";
import { getOrderById } from "../../../models/Market";
import { getIsApproveLand, getIsApproveMarket } from "../../../models/BUSDToken"
import { web3Modal } from "../../../utils/providers/connector";
import { useLazyQuery } from "@apollo/client";
import { GET_MARKET_ITEM_BY_ORDER_ID } from "../../../utils/gql/market";

const OrderDetail = () => {
    const router = useRouter();

    const { wallet } = useWalletContext();

    const [handleFetchMarketItemByOrderId] = useLazyQuery(GET_MARKET_ITEM_BY_ORDER_ID);

    const [loading, setLoading] = useState(false);
    const [isApprovedToken, setIsApprovedToken] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});

    // let active = 2;
    // let items = [];

    // for (let number = 1; number <= 5; number++) {
    //     items.push(
    //         <Pagination.Item key={number} active={number === active}>
    //             {number}
    //         </Pagination.Item>,
    //     );
    // }

    const handleFetchOrderDetail = async () => {
        try{
            setLoading(true);
            const responseMarketItem = await handleFetchMarketItemByOrderId({variables: {orderId: router.query.orderId}});
            const order = await getOrderById(router.query.orderId);
            order.marketId = responseMarketItem.data.markets[0].id || '';
            order.assetId = responseMarketItem.data.markets[0]?.asset?.id || '';
            order.price = responseMarketItem.data.markets[0]?.price;
            order.projectName = responseMarketItem.data.markets[0]?.project?.projectName;
            setOrderDetail(order);
        }catch{

        }finally{
            setLoading(false);
        }
    };

    const initialize = async () => {
        try{
           await handleFetchOrderDetail();
        //    await checkIsApproveUsdc();
        }catch{

        }
    };

    const checkIsApproveUsdc = async () => {
        let res = false;
        if (wallet) {
            let isApprovedToken = await getIsApproveMarket(wallet);

             res = parseInt(BigNumber.from(isApprovedToken)._hex, 16) < 1 ? false : true
            setIsApprovedToken(res);
        } else {
            res = false;
            if (typeof window.ethereum === "undefined") {
                Swal.fire("Warning", "Please, Install metamask wallet", "warning");
            } else {
                Swal.fire("Warning", "Please connect your wallet", "warning");
                const _web3Modal = web3Modal();
                
                await _web3Modal.connect();
            }
        }
        
        return res;
    };

    useEffect(() => {

        if (router.isReady) initialize();

    }, [router.isReady]);

    console.log({orderDetail})

    return (
        <>
            <scetion className="py-5 detail-inventory layout_detailpage">
                <div className="container fix-container my-5">
                    <div className="row layout_detailpage">
                        <div className="col-lg-6 col-12 layout-detail_nav mb-3">
                            <Link href={"/market"}>
                                <p className="nav_detail me-2">Market</p>
                            </Link>
                            <i className="fas fa-circle icon-nav_detail mx-2"></i>
                            <Link href={""}>
                                <p className="nav_detail ms-2">Asset Detail</p>
                            </Link>
                        </div>
                        {/* <div className="col-lg-6 col-12 d-flex" align="right">
                    <div className="position-relative w-100 mx-lg-4 me-3">
                        <input className="form-control search  input-search-set" placeholder="Search" />
                    <i className="fas fa-search icon-search-set"></i>
                    </div>
                    <MarketFillter/>
                </div>   */}
                    </div>
                </div>
                <div className="container fix-container my-5">
                    <div className="row layout-content_detail">
                        <div className="col-xxl-3 col-lg-3 col-12">
                            <img src="/assets/image/card/cannabis.webp" className="w-100" />
                        </div>
                        <div className="col-xxl-9 col-lg-9 col-12 mt-4">
                            {/* <p className="text-brown_detail">Asset Name</p> */}
                            <p className="text-content-tittle_detail">{!loading && orderDetail?.projectName}</p>
                            <hr />
                            <p className="text-brown_detail">Selling Price</p>
                            <div className="d-flex my-2">
                                <img src="/assets/image/modal/usd-coin-usdc-logo_2.svg" />
                                <p className="text-price_detail">{!loading && parseFloat(orderDetail?.price)} <span className="text-black_detail">USDC</span></p>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <p className="text-brown_detail my-1">Status :</p>
                                </div>
                                <div className="col-lg-9">
                                    {!loading && (
                                        <div className="row">
                                            {orderDetail?.available && (
                                                <div className="col-2 my-1 d-flex layout-status_detail me-2">
                                                    <i className="fas fa-circle icon-nav-green_detail me-2"></i>
                                                    <p className="text-green_detail">On Sell</p>
                                                </div>
                                            )}
                                            {/* <div className="col-2 my-1 d-flex layout-status_detail">
                                                <i className="fas fa-circle icon-nav_detail me-2"></i>
                                                <p className="text-brown_detail2">On Hold</p>
                                            </div> */}
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-3">
                                    <p className="text-brown_detail my-1 mb-2">Contract Address :</p>
                                </div>
                                <div className="col-lg-9">
                                    <p className="text-black_detail my-1">{!loading && orderDetail?.landContract}</p>
                                </div>
                                <div className="col-lg-3">
                                    <p className="text-brown_detail my-1">Owner Address :</p>
                                </div>
                                <div className="col-lg-9">
                                    <p className="text-black_detail my-1">{!loading && orderDetail?.owner}</p>
                                </div>
                                <div className="col-lg-3">
                                    <p className="text-brown_detail my-1">Project :</p>
                                </div>
                                <div className="col-lg-9">
                                    <p className="text-black_detail my-1">{!loading && orderDetail?.projectId + 1}</p>
                                </div>
                                <div className="col-lg-3">
                                    <p className="text-brown_detail my-1">Zone :</p>
                                </div>
                                <div className="col-lg-9">
                                    <p className="text-black_detail my-1">{!loading && orderDetail?.zone + 1}</p>
                                </div>
                                <div className="col-lg-3">
                                    <p className="text-brown_detail my-1">Token ID :</p>
                                </div>
                                <div className="col-lg-9">
                                    <p className="text-black_detail my-1">{!loading && orderDetail?.assetToken}</p>
                                </div>
                            </div>

                            <div className="my-2 d-sm-flex">
                                {/* <button className="btn-cancle_detail">Cancle Sell</button> */}
                                <div className="btn-detail_market ">
                                    <Buynow
                                        data={orderDetail}
                                        button="Buy Now"
                                        tittle="Buy Now"
                                        isApprove={isApprovedToken}
                                        checkIsApproveUsdc={checkIsApproveUsdc}
                                        preLoading={loading}
                                    />
                                </div>

                                {/* <div className="btn-detail_market2">
                                    <MakeOffer
                                        button="Make Offer"
                                        tittle="Make offer"
                                        img="/assets/image/card/cannabis.webp"
                                        inputName01="Asset ID"
                                        inputName02="Sell Price"
                                        inputName03="Bid Offer Price"
                                    />
                                </div> */}
                            </div>
                            {/* <TableMarketDetail /> */}
                            
                        </div>
                        {/* <div className="d-flex justify-content-center mt-3">
                            <Pagination><Pagination.First className="set-next" />{items}<Pagination.Last className="set-next" /></Pagination>
                        </div> */}

                    </div>
                </div>
            </scetion>
        </>
    );
};

export default OrderDetail;
OrderDetail.layout = Mainlayout;
