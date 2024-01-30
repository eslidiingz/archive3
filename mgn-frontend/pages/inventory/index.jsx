import React, { useEffect, useState } from "react";
import { useWalletContext } from "../../context/wallet";
import Mainlayout from "../../components/layouts/Mainlayout";
import CardAsset from "../../components/card/CardAsset";
import Pagination from "react-bootstrap/Pagination";
import InventoryFillter from "../../components/fillter/InventoryFillter";
import Spinner from "../../components/Spinner";
import { callClaimLand } from "../../models/Claim";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CouponTable from "../../components/inventory/couponTable";
import CongratulationCoupon from "../../components/modal/CongratulationCoupon";
import MyPlacementContainer from "../../components/inventory/myPlacementContainer";
import Swal from "sweetalert2";
import {
  GET_ALL_ASSETS_BY_WALLET_ADDRESS,
  GET_ALL_MY_PLACEMENTS_BY_WALLET_ADDRESS,
  UPDATE_CLAIM_ASSET,
} from "../../utils/gql/inventory";
import {
  GET_ALL_VOUCHERS_BY_WALLET_ADDRESS,
  GET_VOUCHER_BY_ID,
} from "../../utils/gql/voucher";
import { useLazyQuery, useMutation } from "@apollo/client";

const Inventory = () => {
  const { wallet } = useWalletContext();

  const [handleFetchAssetsByWalletAddress] = useLazyQuery(
    GET_ALL_ASSETS_BY_WALLET_ADDRESS,
    { fetchPolicy: "network-only" }
  );
  const [handleFetchVouchersByWalletAddress] = useLazyQuery(
    GET_ALL_VOUCHERS_BY_WALLET_ADDRESS,
    { fetchPolicy: "network-only" }
  );
  const [handleFetchVoucherById] = useLazyQuery(GET_VOUCHER_BY_ID);
  const [handleFetchMyPlacementsByWalletAddress] = useLazyQuery(
    GET_ALL_MY_PLACEMENTS_BY_WALLET_ADDRESS,
    { fetchPolicy: "network-only" }
  );
  const [handleUpdateClaimAsset] = useMutation(UPDATE_CLAIM_ASSET);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Assets");
  const [vouchers, setVoucher] = useState([]);
  const [myPlacements, setMyPlacement] = useState([]);
  const [voucherDetail, setVoucherDetail] = useState({});
  const [showCongratulationCoupon, setShowCongratulationCoupon] =
    useState(false);
  const [ownedLands, setOwnedLand] = useState([]);
  const [filter, setFilter] = useState({
    status: [],
    project: [],
    zone: [],
  });
  const [paginationDetail, setPaginationDetail] = useState({
    page: 1,
    perPage: 4,
    items: [],
  });

  const handleClaimLand = async (_tokenId) => {
    try {
      setLoading(true);

      const claim = await callClaimLand(_tokenId);

      if (claim) {
        await handleUpdateClaimAsset({ variables: { assetId: _tokenId } });

        Swal.fire("Success", "Used successfully.", "success");
      } else {
        Swal.fire("Warning", "Failed to use.", "warning");
      }
    } catch (e) {
      Swal.fire("Warning", "Failed to use.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async (myLands = []) => {
    let matchedLand = [];
    try {
      Promise.all(
        myLands.map(async (land) => {
          if (filter.status.length) {
          }

          if (filter.project.length) {
          }

          if (filter.zone.length) {
            const data = filter.zone.find((zone) => zone === land.zone);
            if (data) {
              matchedLand.push(land);
            }
          }
        })
      );

      return matchedLand;
    } catch {
      return matchedLand;
    }
  };

  const handleFetchInventoryItem = async () => {
    try {
      setLoading(true);

      const responseAsset = await handleFetchAssetsByWalletAddress({
        variables: {
          walletAddress: wallet,
          isClaim: false,
        },
      });

      console.log("responseAsset", responseAsset);

      const myLands = responseAsset.data.assets;
      console.log({ myLands }, "handleFetchInventoryItem");
      // const matchedLand = await applyFilter(myLands);

      const itemChunks = myLands.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / paginationDetail.perPage);

        if (!resultArray[chunkIndex]) resultArray[chunkIndex] = []; // start a new chunk

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);

      const paginationItems = Array.from(
        { length: itemChunks.length },
        (_, i) => i + 1
      );

      setPaginationDetail((prevState) => ({
        ...prevState,
        items: paginationItems,
      }));

      setOwnedLand(itemChunks[paginationDetail.page - 1] || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (selectedPage) => {
    setPaginationDetail((prevState) => ({
      ...prevState,
      page: selectedPage,
    }));
  };

  const handleChangeFilter = (propName, selectedFilter) => {
    setFilter((prevState) => {
      const foundFilter = prevState[propName].find(
        (value) => value === selectedFilter
      );
      if (foundFilter) {
        return {
          ...prevState,
          [propName]: [
            ...prevState[propName].filter(
              (filterValue) => filterValue !== selectedFilter
            ),
          ],
        };
      } else {
        const prevFilterData = [...prevState[propName]];
        prevFilterData.push(selectedFilter);
        return {
          ...prevState,
          [propName]: [...prevFilterData],
        };
      }
    });
  };

  const handleFetchVoucher = async () => {
    try {
      setLoading(true);
      const responseVoucher = await handleFetchVouchersByWalletAddress({
        variables: { walletAddress: wallet },
      });
      setVoucher(responseVoucher.data.vouchers);
    } catch (e) {
      setVoucher([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMyPlacement = async () => {
    try {
      setLoading(true);
      const responseMyPlacement = await handleFetchMyPlacementsByWalletAddress({
        variables: { walletAddress: wallet },
      });
      console.log({ responseMyPlacement });
      setMyPlacement(responseMyPlacement.data.assets);
    } catch (e) {
      setMyPlacement([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = async (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const initialize = async () => {
    if (activeTab === "Assets") {
      await handleFetchInventoryItem();
    } else if (activeTab === "Coupon") {
      // ****** Voucher == Coupon ******
      await handleFetchVoucher();
    } else if (activeTab === "MyPlacement") {
      await handleFetchMyPlacement();
    }
  };

  const handleShowCongratulationCoupon = async (voucherId) => {
    try {
      // setLoading(true);
      if (voucherId) {
        const responseVoucher = await handleFetchVoucherById({
          variables: { voucherId: voucherId },
        });
        setVoucherDetail(responseVoucher.data.vouchers[0] || {});
      }
      setShowCongratulationCoupon(true);
    } catch (e) {
      console.error(e);
      setVoucherDetail({});
    } finally {
      // setLoading(false);
    }
  };

  const handleCloseCongratulationCoupon = async () =>
    setShowCongratulationCoupon(false);

  useEffect(() => {
    let mounted = true;

    if (mounted) initialize();

    return () => {
      mounted = false;
    };
  }, [wallet, paginationDetail.page, filter.status, filter.zone, activeTab]);

  return (
    <>
      <section className="py-5">
        <div className="container fix-container">
          <div className="row">
            <div className="col-lg-6 col-12 my-3">
              <h4 className="ci-color-brown fw-bolder">My Inventory</h4>
            </div>
            {/* <div className="col-lg-6 col-12 my-3 d-flex" align="right">
                            <div className="position-relative w-75 mx-lg-4 me-3 ">
                                <input className="form-control search  input-search-set" placeholder="Search" />
                                <i className="fas fa-search icon-search-set"></i>
                            </div>
                            <InventoryFillter filter={filter} onChangeFilter={handleChangeFilter} />
                        </div> */}
          </div>
          <div className="layoutmain_CouponTab">
            <Tabs
              defaultActiveKey="Assets"
              className="mb-3"
              onSelect={handleChangeTab}
            >
              <Tab eventKey="Assets" title="Assets" disabled={loading}>
                <div className="row">
                  {loading && (
                    <Spinner
                      showText={false}
                      parentClassName="mt-3"
                      size={"lg"}
                    />
                  )}
                  {!loading && ownedLands.length < 1 && (
                    <h4 className="text-center mt-3">Not Found Item.</h4>
                  )}
                  {!loading &&
                    ownedLands.map((ownedLand, index) => (
                      <div
                        className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 my-2"
                        key={`${index}_`}
                      >
                        <CardAsset
                          data={ownedLand}
                          classname="col-6 px-2"
                          className="d-none"
                          UseButton="Use"
                          UseTittle="Hello"
                          UseImg="/assets/image/card/cannabis.webp"
                          UseDetailmain="Your Plant is grown up!"
                          Useinfomation="Your cannabis plant is fully grown and can be use to increase price Get more 15% of the value and sell it back to us with CNB tokens."
                          UseInputname02="Started Price"
                          UserInputname03="Sell Back Price (+ 15%)"
                          UserTextprice="1 CNB = 1.254 USDC"
                          img="/assets/image/card/cannabis.webp"
                          typecoin="300 USDC"
                          ready={index % 2 === 0 ? true : false}
                          SellButton="Sell"
                          SellTittle="Sell"
                          SellImg="/assets/image/card/cannabis.webp"
                          SellInputname01="Asset ID"
                          SellInputname02="Started Price"
                          SellInputname03="Sell Price"
                          handleClaimLand={handleClaimLand}
                          handleFetchInventoryItem={handleFetchInventoryItem}
                          handleShowCongratulationCoupon={
                            handleShowCongratulationCoupon
                          }
                          disabledButton={loading}
                        />
                      </div>
                    ))}
                  <div className="row">
                    <div className="col-12 d-flex justify-content-center mt-5">
                      <Pagination>
                        <Pagination.First
                          className="set-next"
                          disabled={
                            paginationDetail.page < 2 ||
                            !paginationDetail.items ||
                            loading
                          }
                          onClick={() =>
                            handleChangePage(paginationDetail.page - 1)
                          }
                        />
                        {paginationDetail.items.map((num, index) => (
                          <Pagination.Item
                            key={`${num}_${index}`}
                            active={num === paginationDetail.page}
                            disabled={loading}
                            onClick={() => handleChangePage(num)}
                          >
                            {num}
                          </Pagination.Item>
                        ))}
                        <Pagination.Last
                          className="set-next"
                          disabled={
                            paginationDetail.page ===
                              paginationDetail.items.length ||
                            !paginationDetail.items.length ||
                            loading
                          }
                          onClick={() =>
                            handleChangePage(paginationDetail.page + 1)
                          }
                        />
                      </Pagination>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="MyPlacement"
                title="My Placement"
                disabled={loading}
              >
                <MyPlacementContainer
                  myPlacements={myPlacements}
                  loading={loading}
                />
              </Tab>
              {/* <Tab eventKey="Voucher" title="Voucher" disabled={loading}>
                <div className="overflow">
                  <CouponTable coupons={vouchers} loading={loading} />
                </div>
              </Tab> */}
            </Tabs>
          </div>
        </div>
        <CongratulationCoupon
          data={voucherDetail}
          show={showCongratulationCoupon}
          onClose={handleCloseCongratulationCoupon}
        />
      </section>
    </>
  );
};

export default Inventory;
Inventory.layout = Mainlayout;
