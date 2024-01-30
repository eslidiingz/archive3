import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonState from "../../../components/button/button-state";
import Td from "../../../components/layouts/table-data";
import { ToastDisplay } from "../../../components/ToastDisplay";
import {
  convertWeiToEther,
  numberFormat,
  untilTime,
} from "../../../utils/number";
import {
  avatarContract,
  getMetadata,
  getWalletAccount,
  itemContract,
  marketplaceContract,
} from "../../../utils/web3/init";

const OffersList = () => {
  const [offerList, setOfferList] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [loading, setLoading] = useState({});

  const fetchOfferList = async () => {
    const account = await getWalletAccount();

    const offerLists = await marketplaceContract.methods
      .getOfferLists(account)
      .call();

    const offerItem = await offerLists.filter((item) => {
      return item._active === true && item._isAccept === false;
    });

    const list = offerItem.map(async (item) => {
      const info = await marketplaceContract.methods
        ._getItemInfo(item._marketId)
        .call();

      //ERC1155
      if (info[1]._itemType === "1") {
        const _collection = await itemContract.methods.getBaseUrl().call();
        const _metadata = await getMetadata(
          `${_collection}/${parseInt(info[1]._tokenId)}.json`
        );

        return { item: item, metadata: _metadata, market: info[1] };
      } else if (info[1]._itemType === "2") {
        //ERC721
        const _collection = await avatarContract.methods
          .tokenURI(info[1]._tokenId)
          .call();
        const _metadata = await getMetadata(`${_collection}`);
        return { item: item, metadata: _metadata, market: info[1] };
      }
    });

    const data = await Promise.all(list);

    const listData = await data.filter((item) => {
      return item.market._available === true;
    });
    if (offerList.length === 0 && isSet === false) {
      setOfferList(listData);
      setIsSet(true);
    }
  };

  const acceptOfferList = async (_marketId, _offerId, index) => {
    const account = await getWalletAccount();
    const accept = await marketplaceContract.methods
      .acceptOffer(parseInt(_marketId), parseInt(_offerId))
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
            title={"Transaction reciept"}
            description={"Accept Offer Success !!!"}
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
            title={"Transaction Failed"}
            description={"Transaction Failed please try again"}
          />
        );
      });

    window.location.reload();
  };

  useEffect(() => {
    fetchOfferList();
  }, [offerList]);

  return (
    <main className="content">
      <h1 className="title">Offers List</h1>
      <section className="pt-6 pb-24">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="table-theme">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price (EPIC)</th>
                      <th>From</th>
                      <th>Expiration</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerList.map((item, index) => {
                      return (
                        <tr key={index}>
                          <Td
                            to={`/placements/${item.market._item}/${item.market._tokenId}/${item.market._amount}/${item.market._owner}`}
                            
                          >
                            <div className="flex items-center">
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
                              </div>
                            </div>
                          </Td>
                          <Td
                            to={`/placements/${item.market._item}/${item.market._tokenId}/${item.market._amount}/${item.market._owner}`}
                          >
                            {numberFormat(convertWeiToEther(item.item._price))}
                          </Td>
                          <Td
                            to={`/placements/${item.market._item}/${item.market._tokenId}/${item.market._amount}/${item.market._owner}`}
                          >
                            {item.item._buyer}
                          </Td>
                          <Td
                            to={`/placements/${item.market._item}/${item.market._tokenId}/${item.market._amount}/${item.market._owner}`}
                          >
                            {untilTime(item.item._expiration)}
                          </Td>
                          <td>
                            <ButtonState
                              onFunction={() =>
                                acceptOfferList(
                                  item.item._marketId,
                                  item.item._offerId,
                                  index
                                )
                              }
                              loading={
                                loading.index === index && loading.status
                              }
                              text={"Accept"}
                              classStyle={
                                "btn-theme btn-primary btn-small ml-4 mr-0"
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
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

export default OffersList;
