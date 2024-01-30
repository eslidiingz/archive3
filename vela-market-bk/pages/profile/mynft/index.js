import { useState, useEffect, useMemo } from "react";
import {
  itemContract,
  avatarContract,
  getWalletAccount,
  getMetadata,
  marketplaceContract,
  auctionContract,
  landContract
} from "../../../utils/web3/init";
import CardBuyBid from "../../../components/collections/card-buybid";

const MyCollection = () => {
  const [allList, setAllList] = useState([]);

  const fetchLandCollection = async () => {
    const account = await getWalletAccount();
    const balance = await landContract.methods.balanceOf(account).call();

    const collection = [];

    for(let i = 0; i < balance; i++){
      const tokenId = await landContract.methods
        .tokenOfOwnerByIndex(account, i)
        .call();
      const _meta = await landContract.methods.tokenURI(item).call();
      const json = await getMetadata(`${_meta}`);
      const address = await landContract._address;
      collection.push([1, json, address, tokenId, "ERC721"]);
    }
    const _data = collection.filter((item) => {
      return item[0] !== "0";
    });
    return _data;
  }

  const fetchItemCollection = async () => {
    const account = await getWalletAccount();
    const tokenIds = [0, 1, 2, 3, 4, 5];

    const _collectionUrl = await itemContract.methods.getBaseUrl().call();

    const collection = tokenIds.map(async (item) => {
      const _metadata = await getMetadata(`${_collectionUrl}/${item}.json`);

      const list = await itemContract.methods.balanceOf(account, item).call();
      const address = await itemContract._address;
      const tokenId = await item;
      return [list, _metadata, address, tokenId, "ERC1155"];
    });

    const _collection = await Promise.all(collection);

    const _data = _collection.filter((item) => {
      return item[0] !== "0";
    });

    return _data;
  };

  const checkPlacementAmount = async (_item, _token, _owner) => {
    const itemAddress = _item.toString();
    const tokenId = _token.toString();
    const ownerAddress = _owner.toString();
    const marketList = await marketplaceContract.methods.getItems().call();
    const auctionList = await auctionContract.methods.getAllAuction().call();
    const allList = marketList.concat(auctionList);

    const find = allList.filter(
      (item) =>
        item._available === true &&
        item._item === itemAddress &&
        item._tokenId === tokenId &&
        item._owner === ownerAddress
    );

    const result = find.reduce(function (acc, obj) {
      return acc + parseInt(obj._amount);
    }, 0);

    return result;
  };

  const fetchItemAvailable = async () => {
    let landData = await fetchLandCollection();
    // let itemData = await fetchItemCollection();

    // const allItem = await itemData.concat(landData); //ของใน List
    const allItem = landData;
    const _owner = await getWalletAccount();
    const data = allItem.map(async (item) => {
      const _item = item[2];
      const _token = item[3];
      const _amount = item[0];

      const amountInList = await checkPlacementAmount(_item, _token, _owner);

      const amountTotal = parseInt(_amount) - amountInList;
      return [...item, amountTotal];
    });

    const _data = await Promise.all(data);

    if (allList.length == 0) {
      setAllList(_data);
    }
  };

  useEffect(() => {
    fetchItemAvailable();
  }, []);

  if (!allList) {
    return null;
  }
  return (
    <main className="content">
      <h1 className="title">My Collections</h1>
      <section className="pt-6 pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10">
          <div className="grid grid-cols-5 gap-y-10 gap-x-6 lg:col-span-3 lg:gap-x-8">
            {allList.map((item, index) => {
              return <CardBuyBid key={index} meta={item} type={item[4]} />;
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MyCollection;
