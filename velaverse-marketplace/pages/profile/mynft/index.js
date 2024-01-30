import { useState, useEffect } from "react";
import {
  itemContract,
  avatarContract,
  getWalletAccount,
  getMetadata,
  marketplaceContract,
  auctionContract,
  landFactoryContract
} from "../../../utils/web3/init";
import CardBuyBid from "../../../components/collections/card-buybid";

const MyCollection = () => {
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvatarCollection = async () => {
    const account = await getWalletAccount();
    if(typeof avatarContract.methods.balanceOf === "undefined") return [];
    const balance = await avatarContract.methods.balanceOf(account).call();

    var _collection = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await avatarContract.methods
        .tokenOfOwnerByIndex(account, i)
        .call();

      _collection.push(tokenId);
    }

    const collection = _collection.map(async (item) => {
      if(typeof avatarContract.methods.tokenURI === "undefined") return [0, null, null, null, null];
      const _meta = await avatarContract.methods.tokenURI(item).call();
      const json = await getMetadata(`${_meta}`);
      const address = await avatarContract._address;
      const tokenId = await item;
      return [1, json, address, tokenId, "ERC721"];
    });

    const data = await Promise.all(collection);

    const _data = data.filter((item) => {
      return item[0] !== "0";
    });

    return _data;
  };

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
    setLoading(true);
    const _owner = await getWalletAccount();
    let lands = await fetchLand(_owner);
    console.log(lands);
    // const avatarList = await fetchAvatarCollection();
    // const itemList = await fetchItemCollection();

    // const allItem = await itemList.concat(avatarList); //ของใน List

    const allItem = lands;
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

    setLoading(false);
  };

  const fetchLand = async (account) => {
    // let account = await getWalletAccount();
    let lands = await landFactoryContract.methods.getLandWithOwner(account).call();
    return lands;
  }

  useEffect(() => {
    fetchItemAvailable();
  }, []);

  if (!allList) {
    return null;
  }
  return (
    <>
      <main className="content">
        <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            My Collections
          </h1>
        </div>

        <div>
          {loading ? (
            <div className="loader-page">
              <svg
                className="animate-spin -ml-1 mr-3 h-16 w-16 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
              {allList.map((item, index) => {
                return (
                  <CardBuyBid
                    key={`${item[0]}${item[1]}${item[2]}${index}`}
                    meta={item}
                    type={item[4]}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MyCollection;
