import { useEffect, useState } from "react";
import { Transition } from "@tailwindui/react";
import PlaceItemModal from "./place-item";
import BidItemModal from "./bid-item";
import { openProcess } from "../../utils/config.json";

const CardBuyBid = (props) => {
  const [meta, setMeta] = useState(null);
  const [type, setType] = useState("");
  const [state, setState] = useState(false);
  const [token, setToken] = useState(null);
  const [bidState, setBidState] = useState(false);
  const [bidItem, setBidItem] = useState(null);

  const showCreateList = (e) => {
    setState(!state);
  };

  const showBidList = (e) => {
    setBidState(!bidState);
  };

  const listSellItem = (address, tokenId, image, type, amount) => {
    setState(true);
    setToken({
      address: address,
      tokenId: tokenId,
      image: image,
      type: type,
      amount: amount,
    });
  };

  const listBidItem = (address, tokenId, image, type, amount) => {
    setBidState(true);
    setBidItem({
      address: address,
      tokenId: tokenId,
      image: image,
      type: type,
      amount: amount,
    });
  };

  useEffect(() => {
    setMeta(props.meta);
    setType(props.type);
  }, []);

  if (!meta) {
    return null;
  }
  return (
    <>
      <a className="relative">
        <div className="relative w-full h-72 rounded-lg overflow-hidden">
          <img
            className="w-full h-full object-center object-cover"
            src={
              typeof meta !== "undefined"
                ? meta[1].image
                : "/assets/image/no-image.png"
            }
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="font-medium text-gray-900">
              {typeof meta !== "undefined" ? meta[1].name : "-"}
            </h3>
            <p className="text-gray-500">
              {typeof meta !== "undefined" ? meta[1].description : "-"}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-400 text-right">
              Total : {typeof meta !== "undefined" ? meta[0] : 0}
            </h3>
            <p className="font-medium text-gray-400 text-right">
              Available : {typeof meta !== "undefined" ? meta[5] : 0}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          {openProcess && meta[5] > 0 && (
            <>
              <button
                onClick={() =>
                  listSellItem(meta[2], meta[3], meta[1].image, type, meta[5])
                }
                disabled={meta[5] > 0 ? false : true}
                className={`font-bold py-2 px-4 rounded-full text-white ${
                  meta[5] > 0 ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                Sell
              </button>

              <button
                onClick={() =>
                  listBidItem(meta[2], meta[3], meta[1].image, type, meta[5])
                }
                disabled={meta[5] > 0 ? false : true}
                className={`font-bold py-2 px-4 rounded-full text-white ${
                  meta[5] > 0 ? "bg-yellow-500" : "bg-gray-300"
                }`}
              >
                Bid
              </button>
            </>
          )}
        </div>

        <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"></div>
          <p className="relative text-lg font-semibold text-white">
            {type ? type : "-"}
          </p>
        </div>
      </a>

      <Transition
        className="absolute"
        style={{ zIndex: "100" }}
        show={state}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <PlaceItemModal show={state} onClose={showCreateList} data={token} />
      </Transition>

      <Transition
        className="absolute"
        style={{ zIndex: "100" }}
        show={bidState}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <BidItemModal show={bidState} onClose={showBidList} data={bidItem} />
      </Transition>
    </>
  );
};

export default CardBuyBid;
