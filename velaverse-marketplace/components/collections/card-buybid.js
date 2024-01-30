import { useEffect, useState } from "react";
import { Transition } from "@tailwindui/react";
import PlaceItemModal from "./place-item";
import BidItemModal from "./bid-item";
import Config from "../../utils/config.json";
import Link from "next/link";

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
    <div>
      <div className="relative card-item-collection">
        <div className="relative overflow-hidden">
          <div className="overlay-btn transition-all duration-300">
            {Config.openProcess && meta[5] > 0 && (
              <>
                <button
                  onClick={() =>
                    listSellItem(meta[2], meta[3], meta[1].image, type, meta[5])
                  }
                  disabled={meta[5] > 0 ? false : true}
                  className={`font-bold py-2 px-4 rounded-full text-white ${
                    meta[5] > 0 ? "btn-buybid bg-sell" : "bg-gray-300"
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
                    meta[5] > 0 ? "btn-buybid bg-bid" : "bg-gray-300"
                  }`}
                >
                  Bid
                </button>
              </>
            )}
          </div>

          <div className="card-listing-des cursor-pointer">
            <div>
              {/* <img
                className="card-listing-tag"
                src={"/assets/image/sell_tag.png"}
              /> */}
            </div>

            {meta &&
              typeof meta[1].attributes !== "undefined" && [
                <div className="rarlity-view">
                  {[...Array(parseInt(meta[1].attributes[0].value))].map(
                    (x, i) => {
                      return (
                        <img
                          key={i}
                          className="card-listing-rarity"
                          src={"/assets/image/rare_show.png"}
                        />
                      );
                    }
                  )}
                  {[...Array(5 - parseInt(meta[1].attributes[0].value))].map(
                    (x, i) => {
                      return (
                        <img
                          key={i}
                          className="card-listing-rarity"
                          src={"/assets/image/rare_hide.png"}
                        />
                      );
                    }
                  )}
                </div>,
              ]}
          </div>
          <img
            className="w-full h-full object-center object-cover cursor-pointer"
            src={
              meta && typeof meta[1] !== "undefined"
                ? meta[1].image
                : "/assets/image/no-image.png"
            }
          />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="card-buybid-title">
          {meta && typeof meta[1] !== "undefined" ? meta[1].name : "-"}
        </h3>
        <div>
          {meta &&
            typeof meta[1].attributes !== "undefined" && [
              meta[1].attributes[1].trait_type === "varient" && [
                <div className="flex">
                  {[
                    meta[1].attributes[1].value.map((item, index) => {
                      return (
                        <code
                          key={index}
                          className="bg-tag px-2 rounded text-white mr-2"
                        >
                          {item}
                        </code>
                      );
                    }),
                  ]}
                </div>,
              ],
            ]}
        </div>
      </div>

      <div className="pt-2 flex justify-between items-end">
        <div>
          <h3 className="font-medium text-gray-400 text-left">Sell Type :</h3>
          <p className="font-medium text-primary text-left text-bold">
            {type ? type : "-"}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-400 text-right">
            Total :{" "}
            <span className="text-primary text-bold">
              {typeof meta !== "undefined" ? meta[0] : 0}
            </span>
          </h3>
          <p className="font-medium text-gray-400 text-right">
            Available :{" "}
            <span className="text-primary text-bold">
              {typeof meta !== "undefined" ? meta[5] : 0}
            </span>
          </p>
        </div>

        {/* {meta &&
          typeof meta[1].attributes !== "undefined" && [
            <div className="text-white">
              Type:{" "}
              {meta[1].attributes[2].trait_type === "type" && [
                <div className="flex">
                  {[
                    meta[1].attributes[2].value.map((item, index) => {
                      return (
                        <code
                          key={index}
                          className="bg-gray-400 px-2 rounded text-white mr-2"
                        >
                          {item}
                        </code>
                      );
                    }),
                  ]}
                </div>,
              ]}
            </div>,
          ]} */}
      </div>

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
    </div>
  );
};

export default CardBuyBid;
