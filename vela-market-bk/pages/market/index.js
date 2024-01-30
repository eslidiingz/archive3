import { useState, useEffect } from "react";

import Link from "next/link";
import {
  auctionContract,
  avatarContract,
  getMetadata,
  getWalletAccount,
  itemContract,
  marketplaceContract,
  landContract,
  getTokenSymbol
} from "../../utils/web3/init";
import CardListing from "../../components/collections/card-listing";
import { numberFormat, untilTime, convertWeiToEther } from "../../utils/number";

const Market = () => {
  var tabItems = [
    { name: "Sell", count: 0, current: true },
    // { name: "Auction", count: 0, current: false },
  ];
  const [allList, setAllList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [auctionList, setAuctionList] = useState([]);
  const [tabs, setTabs] = useState(tabItems);
  const [tabActived, setTabActived] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("CLASS");

  const setTabActive = (tabIndex) => {
    let _temp = [];
    setTabActived(tabIndex);
    tabs.map((item, index) => {
      item.current = false;

      if (index == tabIndex) {
        item.current = true;
      }
      _temp.push(item);
    });

    setTabs(_temp);
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  function filter(collection, predicate) {
    var result = new Array();
    var length = collection.length;

    for (var j = 0; j < length; j++) {
      if (predicate(collection[j]) == true) {
        result.push(collection[j]);
      }
    }

    return result;
  }

  const fetchPlaceItemList = async () => {
    const account = await getWalletAccount();
    const itemList = await marketplaceContract.methods.getItems().call();
    console.log(itemList);
    const _placeItem = itemList.map(async (item) => {
      //1 = ERC1155, 2 = ERC721
      if (item._itemType === "1") {
        const _collection = await itemContract.methods.getBaseUrl().call();
        const _metadata = await getMetadata(
          `${_collection}/${item._tokenId}.json`
        );

        return [parseInt(item._amount), _metadata, item, "ERC1155", "SELL"];
      } else if (item._itemType === "2") {
        const _collection = await landContract.methods
          .tokenURI(item._tokenId)
          .call();
        const _metadata = await getMetadata(`${_collection}`);

        return [parseInt(item._amount), _metadata, item, "ERC721", "SELL"];
      }
    });

    const item = await Promise.all(_placeItem);

    let showDateStart = new Date();
    showDateStart.setDate(showDateStart.getDate());

    const filter = await item.filter((item) => {
      return (
        item[2]._available === true &&
        item[2]._owner !== account &&
        new Date(item[2]._expiration * 1000) >= showDateStart
      );
    });
    return filter;
  };

  const fetchBidItemList = async () => {
    const account = await getWalletAccount();
    const auctionList = await auctionContract.methods.getAllAuction().call();

    const _placeItem = auctionList.map(async (item) => {
      if (item._itemType === "1") {
        const _collection = await itemContract.methods.getBaseUrl().call();
        const _metadata = await getMetadata(
          `${_collection}/${item._tokenId}.json`
        );
        return [parseInt(item._amount), _metadata, item, "ERC1155", "BID"];
      } else if (item._itemType === "2") {
        const _collection = await landContract.methods
          .tokenURI(item._tokenId)
          .call();
        const _metadata = await getMetadata(`${_collection}`);
        return [parseInt(item._amount), _metadata, item, "ERC721", "BID"];
      }
    });

    const item = await Promise.all(_placeItem);

    const filter = await item.filter((item) => {
      let showDateStart = new Date();
      showDateStart.setDate(showDateStart.getDate());

      return (
        item[2]._available === true &&
        item[2]._owner !== account &&
        new Date(item[2]._expiration * 1000) >= showDateStart
      );
    });

    return filter;
  };

  const fetchAllPlacementList = async () => {
    let placement = await fetchPlaceItemList();
    let auction = await fetchBidItemList();

    const allItem = placement.concat(auction);

    if (allList.length === 0) {
      setAllList(allItem);
    }
  };

  useEffect(async () => {
    setTokenSymbol(await getTokenSymbol());
    fetchAllPlacementList();
  }, []);

  if (!allList) {
    return null;
  }

  return (
    <main className="content">
      <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200 mb-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Market List
        </h1>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-4 gap-y-6">
          {allList.map((item, index) => {
            return (
              <Link
                key={index}
                className="cursor-pointer"
                href={`/placements/${item[2]._item}/${item[2]._tokenId}/${item[2]._amount}/${item[2]._owner}`}
              >
                <div className="card card flex flex-col justify-between">
                  <div className="card-body">
                    <CardListing meta={item} />
                  </div>
                  <div className="p-2">
                    <div>Type: {item[3]}</div>
                    <div>Until: {untilTime(item[2]._expiration)}</div>
                    <div>
                      Price: {numberFormat(convertWeiToEther(item[2]._price))}{" "}
                      {tokenSymbol}
                    </div>

                    <small>
                      <code className="bg-orange-400 px-2 rounded text-white">
                        {item[4]}
                      </code>
                    </small>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Market;
