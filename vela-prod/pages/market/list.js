import { useEffect, useState } from "react";
// import { useMoralis } from "react-moralis";
import CardListing from "../../components/collections/card-listing";
import { abiMarketplace } from "../../utils/abis/main";

import Config from "../../utils/config";

import { getWalletAccount } from "../../utils/web3/init";

const MarketListPage = () => {
  // const { Moralis } = useMoralis();
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMarketList = async () => {
    try {
      await Moralis.start({
        appId: Config.APP_ID,
        serverUrl: Config.SERVER_URL,
      });
      await Moralis.enableWeb3();
      const web3 = new Web3(Moralis.provider);
      const account = await getWalletAccount();
      const options = {
        contractAddress: Config.MARKETPLACE_ADDR,
        functionName: "getItems",
        abi: abiMarketplace,
      };
      const data = await Moralis.executeFunction(options);

      let showDateStart = new Date();
      showDateStart.setDate(showDateStart.getDate());

      const listData = await data.filter((item) => {
        return (
          item._available === true &&
          item._owner !== account &&
          new Date(item._expiration * 1000) >= showDateStart
        );
      });

      const _placeItem = listData.map(async (item) => {
        //1 = ERC1155, 2 = ERC721
        if (item._itemType === 1) {
          // const _collection = await itemContract.methods.getBaseUrl().call();
          // const _metadata = await getMetadata(
          //   `${_collection}/${item._tokenId}.json`
          // );
          // return [parseInt(item._amount), _metadata, item, "ERC1155", "SELL"];
        } else if (item._itemType === 2) {
          // const _collection = await avatarContract.methods
          //   .tokenURI(item._tokenId)
          //   .call();
          // const _metadata = await getMetadata(_collection);
          // return [parseInt(item._amount), _metadata, item, "ERC721", "SELL"];
        }
      });

      const item = await Promise.all(_placeItem);

      return item;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllPlacementList = async () => {
    setLoading(true);
    const itemList = await fetchMarketList();
    // const auctionList = await fetchBidItemList();

    // const allItem = itemList.concat(auctionList);

    if (allList.length === 0) {
      setAllList(itemList);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllPlacementList();
  }, []);

  if (!allList) {
    return null;
  }

  return (
    <>
      <main className="content">
        <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Market List
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
              {allList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="card flex flex-col justify-between"
                  >
                    <div className="card-body p-2">
                      <CardListing meta={item} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};
export default MarketListPage;
