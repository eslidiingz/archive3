import { useEffect, useState, useCallback } from "react";
import ButtonState from "../../components/button/button-state";
import { convertWeiToEther, numberFormat, untilTime } from "../../utils/number";
import Config from "../../utils/config";
import {
  auctionContract,
  getMetadata,
  getStrTokenSymbol,
  getWalletAccount,
  landContract,
  marketplaceContract,
  mintContract,
  tokenContract,
} from "../../utils/web3/init";

import { unlimit } from "../../utils/global";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../components/ToastDisplay";
import Td from "../../components/layouts/table-data";

import { fetchABIWhitelist } from "../../utils/api/whitelist";
// import { useMoralis } from "react-moralis";
import { abiMarketplace, abiAuction } from "../../utils/abis/main";
import { mapZoneByAddress, smLandFn } from "../../utils/web3/land";

const PlacementsList = () => {
  // const { Moralis } = useMoralis();
  const [approve, setApprove] = useState(null);
  const [state, setState] = useState(null);
  const [placementList, setPlacementList] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [loading, setLoading] = useState({});
  const [cancelPlacement, setCancelPlacement] = useState(false);
  const [approvePlacement, setApprovePlacement] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const getMarketList = async () => {
    try {
      const _account = await getWalletAccount();
      const data = await marketplaceContract.methods.getItems().call();
      const listData = await data.filter(
        (item) => item._owner === _account && item._available === true
      );

      const _placeItem = listData.map(async (item) => {
        const info = await marketplaceContract.methods
          ._getItemInfo(item._marketId)
          .call();

        if (item._itemType === "2") {
          let contract;
          if (item._item.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()) {
            contract = mintContract;
          } else {
            contract = smLandFn(item._item);
          }
          const _data = await contract.methods.tokenURI(item._tokenId).call();

          const _metadata = await getMetadata(_data);

          return { item: item, metadata: _metadata, market: info[1] };
        }
      });

      const item = await Promise.all(_placeItem);

      return item;
    } catch (error) {
      console.log(error);
    }
  };

  const getAuctionList = async () => {
    try {
      const _account = await getWalletAccount();
      const data = await auctionContract.methods.getAllAuction().call();
      const listData = await data.filter(
        (item) => item._owner === _account && item._available === true
      );

      const _placeItem = listData.map(async (item) => {
        const info = await auctionContract.methods
          ._getItemInfo(item._marketId)
          .call();
        if (item._itemType === "2") {
          let contract;
          if (item._item.toLowerCase() === Config.LAND_ADDR.toLowerCase()) {
            contract = landContract;
          } else if (
            item._item.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()
          ) {
            contract = mintContract;
          }
          const _data = await contract.methods.tokenURI(item._tokenId).call();

          const _metadata = await getMetadata(_data);

          return { item: item, metadata: _metadata, market: info[1] };
        }
      });

      const item = await Promise.all(_placeItem);
      return item;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlacementList = async () => {
    const list = await getMarketList();
    const auction = await getAuctionList();

    let _all = list.concat(auction);
    const listData = await Promise.all(_all);

    return listData;
  };

  const checkAllowance = async () => {
    try {
      const account = await getWalletAccount();
      const allowance = await tokenContract.methods
        .allowance(account, Config.AUCTION_ADDR)
        .call();

      if (state === null) {
        if (allowance <= 0) {
          setApprove(false);
        } else {
          setApprove(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setApproveToken = async (index) => {
    try {
      const account = await getWalletAccount();

      const approve = await tokenContract.methods
        .approve(Config.AUCTION_ADDR, unlimit)
        .send({ from: account })
        .on("sending", function (result) {
          setLoading({
            index: index,
            status: true,
          });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading({
            index: index,
            status: false,
          });
          setApprove(true);

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction Success"}
              description={"Approve Success !!!"}
            />
          );
        })
        .on("error", function (error) {
          setLoading({
            index: index,
            status: false,
          });

          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction Error"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  const checkTokenAllowancePlacement = async () => {
    try {
      let allowance = await tokenContract.methods
        .allowance(await getWalletAccount(), Config.MARKETPLACE_ADDR)
        .call();

      if (allowance > 0) {
        setApprovePlacement(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setAllowancePlacement = async (index) => {
    try {
      let approved = await tokenContract.methods
        .approve(Config.MARKETPLACE_ADDR, unlimit)
        .send({ from: await getWalletAccount() })
        .on("sending", function (result) {
          setLoading({ index: index, status: true });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading(false);
          setBidStatus(true);

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction Success"}
              description={"Approve Success !!!"}
            />
          );
        })
        .on("error", function (error) {
          setLoading(false);

          toast(
            <ToastDisplay
              type={"error"}
              title={"Transaction Error"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        });

      await checkTokenAllowancePlacement();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelPlacementList = async (_marketId, index) => {
    try {
      const account = await getWalletAccount();

      let canceled = await marketplaceContract.methods
        .cancelItem(parseInt(_marketId))
        .send({ from: account })
        .on("sending", function (result) {
          setLoading({
            index: index,
            status: true,
          });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading({
            index: index,
            status: false,
          });

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction success"}
              description={"Cancel placement success !!!"}
              href={`${Config.BLOCK_EXPLORER}/tx/${receipt.transactionHash}`}
            />
          );
        })
        .on("error", function (error) {
          setLoading({
            index: index,
            status: false,
          });

          <ToastDisplay
            type={"error"}
            title={"Transaction rejected"}
            description={error.message}
          />;
        });

      if (canceled.status) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelAuctionList = async (_marketId, index) => {
    try {
      const account = await getWalletAccount();

      let canceled = await auctionContract.methods
        .cancelAuction(parseInt(_marketId))
        .send({ from: account })
        .on("sending", function (result) {
          setLoading({
            index: index,
            status: true,
          });

          toast(
            <ToastDisplay
              type={"process"}
              title={"Waiting For Confirmation"}
              description={"Confirm this transaction in your wallet"}
            />
          );
        })
        .on("receipt", function (receipt) {
          setLoading({
            index: index,
            status: false,
          });

          toast(
            <ToastDisplay
              type={"success"}
              title={"Transaction success"}
              description={"Cancel placement success !!!"}
              href={`${Config.BLOCK_EXPLORER}/tx/${receipt.transactionHash}`}
            />
          );
        })
        .on("error", function (error) {
          setLoading({
            index: index,
            status: false,
          });

          <ToastDisplay
            type={"error"}
            title={"Transaction rejected"}
            description={error.message}
          />;
        });

      if (canceled.status) {
        await fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = useCallback(async () => {
    setPageLoading(true);
    const fetchingData = async () => {
      const currentData = await fetchPlacementList();

      currentData.map((_d) => {
        const _map = mapZoneByAddress(_d.market._item);

        _d.mapName = _map?.name;
        _d.mapZone = _map?.zone;
        _d.mapImage = _map?.image;
      });

      setPlacementList(currentData);
      setPageLoading(false);
    };

    await fetchingData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    checkAllowance();
    checkTokenAllowancePlacement();
  }, []);

  return (
    <>
      <div className="heading">
        <h2>Placements List</h2>
        <p>
          Here you can search and buy creator&apos;s ASSETS with Class to
          incorporate them into your LAND
        </p>
      </div>
      <section className="vela-fluid">
        <div className="content">
          <div className="table-theme-warper">
            <table className="table-theme">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Price ({getStrTokenSymbol()})</th>
                  <th>Expiration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pageLoading ? (
                  <tr>
                    <td colSpan="6" align="center">
                      Loading ...
                    </td>
                  </tr>
                ) : placementList.length > 0 ? (
                  placementList.map((item, index) => {
                    return (
                      <tr key={index}>
                        <Td
                          to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                        >
                          <div className="td-product-desc-lg">
                            <div className="img">
                              <img
                                className="img-table"
                                src={item.mapImage}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    "/assets/image/no-image.jpg";
                                }}
                              />
                              {/* <img
                                className="img-table"
                                src={item.metadata.image_cdn}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    "/assets/image/no-image.jpg";
                                }}
                              /> */}
                            </div>
                            <div className="desc">
                              <div>{item.mapZone}</div>
                              {/* <div>{item.metadata.name}</div> */}
                              <div>Contract Address: {item.item._item}</div>
                              <div>
                                Token Id: {parseInt(item.item._tokenId)}
                              </div>
                              <div>
                                Token Type:{" "}
                                {item.item._itemType === "1"
                                  ? "ERC1155"
                                  : "ERC721"}
                              </div>
                            </div>
                          </div>
                        </Td>

                        <Td
                          to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                        >
                          {typeof item.item._terminatePrice !== "undefined"
                            ? "BID"
                            : "SELL"}
                        </Td>
                        <Td
                          to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                        >
                          {item.market._amount}
                        </Td>
                        <Td
                          to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                        >
                          {numberFormat(convertWeiToEther(item.item._price))}
                        </Td>
                        <Td
                          to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                        >
                          {untilTime(item.item._expiration)}
                        </Td>
                        <td>
                          {typeof item.item._terminatePrice !== "undefined" ? (
                            [
                              approve ? (
                                item.item._status === "0" && (
                                  <ButtonState
                                    onFunction={() =>
                                      cancelAuctionList(
                                        item.item._marketId,
                                        index
                                      )
                                    }
                                    loading={
                                      loading.index === index && loading.status
                                    }
                                    text={"Cancel Bid"}
                                    classStyle={
                                      "btn-theme btn-primary btn-small ml-4 mr-0"
                                    }
                                  />
                                )
                              ) : (
                                <ButtonState
                                  onFunction={() => setApproveToken(index)}
                                  loading={
                                    loading.index === index && loading.status
                                  }
                                  text={"Approve Cancel Bid"}
                                  classStyle={
                                    "btn-theme btn-secondary-long btn-small-long mr-0"
                                  }
                                />
                              ),
                            ]
                          ) : approvePlacement === false ? (
                            <ButtonState
                              onFunction={() => setAllowancePlacement(index)}
                              loading={
                                loading.index === index && loading.status
                              }
                              text="Approve Cancel Sell"
                              classStyle={
                                "btn-theme btn-primary btn-small ml-4 mr-0"
                              }
                            />
                          ) : (
                            <ButtonState
                              onFunction={() =>
                                cancelPlacementList(item.item._marketId, index)
                              }
                              loading={
                                loading.index === index && loading.status
                              }
                              text="Cancel Sell"
                              classStyle={
                                "btn-theme btn-primary btn-small ml-4 mr-0"
                              }
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-center" colSpan={6}>
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlacementsList;
