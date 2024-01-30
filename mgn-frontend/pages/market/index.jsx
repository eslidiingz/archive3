import { useState, useEffect } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import Link from "next/link";
import React from "react";
import Pagination from 'react-bootstrap/Pagination';
import MarketFillter from "../../components/fillter/MarketFillter";
import CardAsset from "../../components/card/CardAsset";
import ItemCard from "../../components/market/itemCard";
import Spinner from "../../components/Spinner";

import { getMarketItem } from "../../models/Market";
import { useWalletContext } from "../../context/wallet";

import { GET_ALL_MARKET_ITEMS } from "../../utils/gql/market";
import { useLazyQuery } from "@apollo/client";


// import InventoryFillter from "../../components/fillter/InventoryFillter";
// import MakeOffer from "../../components/modal/MakeOffer";
// import SellUser from "../../components/modal/SellUser";
// import Buynow from "../../components/modal/Buynow";

const Market = () => {
    const { wallet } = useWalletContext();

    const [handleFetchAllMarketItems] = useLazyQuery(GET_ALL_MARKET_ITEMS, {fetchPolicy: 'network-only'});

    const [loading, setLoading] = useState(false);
    const [items, setItem] = useState([]);
    const [show, setShow] = useState(false);

    const [paginationDetail, setPaginationDetail] = useState({
        page: 1,
        perPage: 4,
        items: []
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const handleFetchMarketItem = async () => {
        try{
            setLoading(true);

            // const products = await getMarketItem();

            const responseMarketItem = await handleFetchAllMarketItems();

            const products = responseMarketItem.data.markets;

            const itemChunks = products.reduce((resultArray, item, index) => { 

            const chunkIndex = Math.floor(index / paginationDetail.perPage);
            
                if(!resultArray[chunkIndex]) resultArray[chunkIndex] = []; // start a new chunk
                
                resultArray[chunkIndex].push(item);
                
                return resultArray;
            }, []);

            const paginationItems = Array.from({length: itemChunks.length}, (_, i) => i + 1);

            setPaginationDetail((prevState) => ({
                ...prevState,
                items: paginationItems
            }));

           console.log({products})

           setItem(itemChunks[paginationDetail.page - 1] || []);

        }catch (e){
            setItem([]);
        }finally{
            setLoading(false);
        }
    };

    const handleChangePage = (selectedPage) => {
        setPaginationDetail((prevState) => ({
            ...prevState,
            page: selectedPage
        }));
    };

    const initialize = async () => {
       await handleFetchMarketItem();
    };

    useEffect(() => {
        let mounted = true;

        if (mounted) initialize();

        return () => {
            mounted = false;
        }
    }, [wallet, paginationDetail.page]);

    return (
        <>
            <section>
                <div>
                    <img src="../assets/image/market/Ads_1808New2.png" className="w-100 d-lg-block d-none mb-5"/>
                    <img src="../assets/image/market/Ads_992New2.png" className="w-100 d-lg-none d-sm-block d-none mb-5"/>
                    <img src="../assets/image/market/Ads_440New2.png" className="w-100 d-sm-none d-block mb-5"/>

                </div>
                <div className="container fix-container">
                    <div className="row layout-main_market">
                        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 layout-center_market">
                            <p className="text-tittle_market">Market</p>
                        </div>
                        {/* <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12 d-flex" align="right">
                            <div className="position-relative w-75 mx-lg-4 me-3">
                                <input className="form-control search  input-search-set" placeholder="Search" />
                                <i className="fas fa-search icon-search-set"></i>
                            </div>
                            <MarketFillter />
                        </div> */}
                    </div>
                    <div className="row">
                        {loading && <Spinner showText={false} parentClassName="mt-3" size={'lg'}/>}
                        {!loading && items.length < 1 && <h4 className="text-center mt-3">Not Found Item.</h4>}
                        {!loading && items.map((item, index) => (
                            <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 my-2" key={index}>
                                <ItemCard
                                    data={item}
                                    img="/assets/image/card/cannabis.webp"
                                    des="Cannabis is growing We are growing cannabis plants for you. growing cannabis plants for you."
                                    typecoin="300 USDC"
                                    zone="1"
                                    classname="d-none"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                                <Pagination.First className="set-next" disabled={paginationDetail.page < 2 || !paginationDetail.items || loading} onClick={() => handleChangePage(paginationDetail.page - 1)} />
                                    {paginationDetail.items.map((num, index) => (
                                        <Pagination.Item key={`${num}_${index}`} active={num === paginationDetail.page} disabled={loading} onClick={() => handleChangePage(num)}>
                                            {num}
                                        </Pagination.Item>
                                    ))}
                                <Pagination.Last className="set-next" disabled={paginationDetail.page === paginationDetail.items.length || !paginationDetail.items.length || loading} onClick={() => handleChangePage(paginationDetail.page + 1)} />
                            </Pagination>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Market;
Market.layout = Mainlayout;
