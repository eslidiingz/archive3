import { useEffect, useState, useCallback } from "react";
import ButtonState from "../../components/button/button-state";
import { convertWeiToEther, numberFormat, untilTime } from "../../utils/number";
import {
  auctionContract,
  avatarContract,
  getMetadata,
  getWalletAccount,
  itemContract,
  marketplaceContract,
  tokenContract,
} from "../../utils/web3/init";

import Config from "../../utils/config.json";
import { unlimit } from "../../utils/global";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../components/ToastDisplay";
import Td from "../../components/layouts/table-data";

const PlacementsList = () => {
  const [approve, setApprove] = useState(null);
  const [state, setState] = useState(null);
  const [placementList, setPlacementList] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [loading, setLoading] = useState({});
  const [cancelPlacement, setCancelPlacement] = useState(false);
  const [approvePlacement, setApprovePlacement] = useState(false);

  const fetchPlacementList = async () => {
    const account = await getWalletAccount();

    const placementsList = await marketplaceContract.methods.getItems().call();

    const auctionsList = await auctionContract.methods.getAllAuction().call();

    const lists = placementsList.concat(auctionsList);

    const placements = await lists.filter(
      (item) => item._owner === account && item._available === true
    );

    const list = placements.map(async (item) => {
      if (typeof item._terminatePrice !== "undefined") {
        const info = await auctionContract.methods
          ._getItemInfo(item._marketId)
          .call();

        if (info[1]._itemType === "1") {
          const _collection = await itemContract.methods.getBaseUrl().call();
          const _metadata = await getMetadata(
            `${_collection}/${parseInt(info[1]._tokenId)}.json`
          );

          return { item: item, metadata: _metadata, market: info[1] };
        } else if (info[1]._itemType === "2") {
          const _collection = await avatarContract.methods
            .tokenURI(info[1]._tokenId)
            .call();
          const _metadata = await getMetadata(`${_collection}`);
          return { item: item, metadata: _metadata, market: info[1] };
        }
      } else {
        const info = await marketplaceContract.methods
          ._getItemInfo(item._marketId)
          .call();

        if (info[1]._itemType === "1") {
          const _collection = await itemContract.methods.getBaseUrl().call();
          const _metadata = await getMetadata(
            `${_collection}/${parseInt(info[1]._tokenId)}.json`
          );

          return { item: item, metadata: _metadata, market: info[1] };
        } else if (info[1]._itemType === "2") {
          const _collection = await avatarContract.methods
            .tokenURI(info[1]._tokenId)
            .call();
          const _metadata = await getMetadata(`${_collection}`);
          return { item: item, metadata: _metadata, market: info[1] };
        }
      }
    });

    const listData = await Promise.all(list);

    return listData;

    // if (placementList.length === 0 && isSet === false) {
    //   setPlacementList(listData);
    //   setIsSet(true);
    // }
  };

  const checkAllowance = async () => {
    const account = await getWalletAccount();
    const allowance = await tokenContract.methods
      .allowance(account, Config.MarketAuctionAddress)
      .call();

    if (state === null) {
      if (allowance <= 0) {
        setApprove(false);
      } else {
        setApprove(true);
      }
    }
  };

  const setApproveToken = async (index) => {
    const account = await getWalletAccount();

    const approve = await tokenContract.methods
      .approve(Config.MarketAuctionAddress, unlimit)
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
  };

  const checkTokenAllowancePlacement = async () => {
    let allowance = await tokenContract.methods
      .allowance(await getWalletAccount(), Config.MarketPlaceAddress)
      .call();

    console.log(allowance);

    if (allowance > 0) {
      setApprovePlacement(true);
    }
  };

  const setAllowancePlacement = async (index) => {
    let approved = await tokenContract.methods
      .approve(Config.MarketPlaceAddress, unlimit)
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
  };

  const cancelPlacementList = async (_marketId, index) => {
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
            href={`${Config.blockExplorer}/tx/${receipt.transactionHash}`}
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
  };

  const cancelAuctionList = async (_marketId, index) => {
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
            href={`${Config.blockExplorer}/tx/${receipt.transactionHash}`}
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
  };

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const currentData = await fetchPlacementList();
      setPlacementList(currentData);
    };

    fetchingData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    checkAllowance();
    checkTokenAllowancePlacement();
  }, []);

  return (
    <main className="content">
      <h1 className="title">My Placement List</h1>
      <section className="pt-6 pb-24">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="table-theme">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Price (EPIC)</th>
                      <th>Expiration</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {placementList.length > 0 ? (
                      placementList.map((item, index) => {
                        return (
                          <tr key={index}>
                            <Td
                              to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                            >
                              <div className="flex items-center ">
                                <div>
                                  <img
                                    className="img-table"
                                    src={item.metadata.image}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div>
                                    {item.metadata.name}
                                  </div>
                                  <div>
                                    Contract Address: {item.item._item}
                                  </div>
                                  <div>
                                    Token Id: {item.item._tokenId}
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
                              {numberFormat(
                                convertWeiToEther(item.item._price)
                              )}
                            </Td>
                            <Td
                              to={`/placements/${item.item._item}/${item.item._tokenId}/${item.item._amount}/${item.item._owner}`}
                            >
                              {untilTime(item.item._expiration)}
                            </Td>
                            <td>
                              {typeof item.item._terminatePrice !==
                              "undefined" ? (
                                [
                                  approve ? (
                                    <ButtonState
                                      onFunction={() =>
                                        cancelAuctionList(
                                          item.item._marketId,
                                          index
                                        )
                                      }
                                      loading={
                                        loading.index === index &&
                                        loading.status
                                      }
                                      text={"Cancel Bid"}
                                      classStyle={
                                        "btn-theme btn-secondary-long btn-small-long mr-0"
                                      }
                                    />
                                  ) : (
                                    <ButtonState
                                      onFunction={() => setApproveToken(index)}
                                      loading={
                                        loading.index === index &&
                                        loading.status
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
                                  onFunction={() =>
                                    setAllowancePlacement(index)
                                  }
                                  loading={
                                    loading.index === index && loading.status
                                  }
                                  text="Approve Cancel Sell"
                                  classStyle={
                                    "btn-theme btn-secondary-long btn-small-long mr-0"
                                  }
                                />
                              ) : (
                                <ButtonState
                                  onFunction={() =>
                                    cancelPlacementList(
                                      item.item._marketId,
                                      index
                                    )
                                  }
                                  loading={
                                    loading.index === index && loading.status
                                  }
                                  text="Cancel Sell"
                                  classStyle={
                                    "btn-theme btn-secondary-long btn-small-long mr-0"
                                  }
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-6 py-4 text-center" colSpan={5}>
                          No Data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PlacementsList;
