import { Transition } from "@tailwindui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";
import PlaceItemModal from "./place-item";
import BidItemModal from "./bid-item";
import Config from "/utils/config";

function CardAssetOwner(props) {
  const [meta, setMeta] = useState(null);
  const [state, setState] = useState(false);
  const [token, setToken] = useState(null);
  const [bidState, setBidState] = useState(false);
  const [bidItem, setBidItem] = useState(null);
  const [assetVisible, setAssetVisible] = useState(true);

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

  const fetchJson = async (props) => {
    try {
      if (meta === null) {
        let itemAddress = props.meta.token_address;
        let tokenId = props.meta.token_id;
        let url = `${Config.COLLECTION_API}/assets/${itemAddress}/${tokenId}`;
        // let url = `https://collection.velaverse.io/api/v1/assets/${itemAddress}/${tokenId}`;
        let assetData = await fetch(url);
        let data = await assetData.json();

        if (data.length > 0) {
          props.meta.is_verify = data[0].verify === "Y" ? true : false;
        }
        if (typeof props.meta.metadata === "string") {
          props.meta.metadata = JSON.parse(props.meta.metadata);
        } else {
          props.meta.metadata = props.meta.metadata;
        }

        if (typeof data?.[0]?.visible === "boolean") {
          props.meta.visible = data?.[0]?.visible;
        } else {
          props.meta.visible = true;
        }

        setAssetVisible(props?.meta?.visible);
        console.log(props.meta);
        setMeta(props.meta);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAssetVisible = async (visible) => {
    try {
      let itemAddress = props.meta.token_address;
      let tokenId = props.meta.token_id;
      visible = typeof visible === "boolean" ? visible : true;

      const url = `${Config.COLLECTION_API}/assets/${itemAddress}/${tokenId}/visible`;
      const updateVisibleResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visible }),
      });

      const responseSuccess = await updateVisibleResponse.json();

      if (responseSuccess?.status) {
        toast(
          <ToastDisplay
            type={"success"}
            title={"Success"}
            description={"Changed visible success !!!"}
          />
        );
      } else {
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction failed"}
            description={"Failed to change visible, please try again"}
          />
        );
      }
    } catch (err) {
      console.error(err.message);
    }

    setAssetVisible(visible);
  };

  useEffect(() => {
    fetchJson(props);
  }, []);

  if (typeof meta === "undefined") {
    return null;
  }

  // console.log(meta)
  return (
    <div>
      <div className="card-item">
        <div className="relative overflow-hidden item-collection-inset">
          <div className="overlay-btn transition-all duration-300">
            {meta && typeof meta !== "undefined" && meta.status && (
              <a
                href={`/placements/${meta.data._item}/${meta.data._tokenId}/${meta.data._amount}/${meta.data._owner}`}
              >
                <a target="_blank">
                  <button className="btn-overlay-cover btn-sell">
                    <span>Detail</span>
                  </button>
                </a>
              </a>
            )}
            {Config.OPEN_PROCESS &&
              meta &&
              typeof meta !== "undefined" &&
              meta.status == false &&
              meta.asset_type !== "sut" && (
                <>
                  {/* <Link href="https://www.binance.com/en/nft/deposit">
                    <a target="_blank">
                      <button className="btn-overlay-cover btn-binance">
                        <span>List NFT on</span>
                        <p>Binance</p>
                      </button>
                    </a>
                  </Link> */}
                  <button
                    onClick={() =>
                      listSellItem(
                        meta.token_address,
                        meta.token_id,
                        meta.metadata?.image_cdn ||
                          "/assets/image/no-image.jpg",
                        "ERC721",
                        1
                      )
                    }
                    className="btn-overlay-cover btn-sell btn-overlay-cover"
                  >
                    Sell
                  </button>
                  <button
                    onClick={() =>
                      listBidItem(
                        meta.token_address,
                        meta.token_id,
                        meta.metadata.image_cdn,
                        "ERC721",
                        1
                      )
                    }
                    className="btn-overlay-cover btn-bid btn-overlay-cover"
                  >
                    Bid
                  </button>
                </>
              )}
          </div>

          <div className="product-img-cover">
            <img
              className="product-img"
              src={
                meta &&
                typeof meta.metadata !== "undefined" &&
                meta.metadata &&
                typeof meta.metadata.image_cdn !== "undefined"
                  ? meta.metadata.image_cdn
                  : "/assets/image/no-image.jpg"
              }
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "/assets/image/no-image.jpg";
              }}
            />
          </div>
        </div>
        {meta && meta.is_verify && <div className="tag-verify">Verified</div>}

        <div className="mt-2">
          {/* <div>{meta}</div> */}
          {/* <h3 className="card-buybid-title">
            {meta &&
            typeof meta.metadata !== "undefined" &&
            meta.metadata &&
            typeof meta.metadata.name !== "undefined" &&
            meta.metadata.name !== null
              ? `${meta.metadata.name}#${meta.token_id}`
              : "-"}
          </h3> */}
          <div>{meta ? `Map: ${meta.asset_type.toUpperCase()}` : ""}</div>
          <div>{meta ? `Token Id: #${meta.token_id}` : ""}</div>

          {meta && meta.item !== null && meta.type == "land"
            ? [
                typeof meta.item !== "undefined" &&
                  meta.location && [
                    <span>
                      <p className="product-location">
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {meta?.location?.x},{meta?.location?.y}
                      </p>
                    </span>,
                  ],
              ]
            : meta && (
                <span>
                  <p className="product-size">
                    <i className="fas fa-map-size-alt"></i>
                    Building Size : {meta.metadata?.attributes?.size_x} x{" "}
                    {meta?.metadata?.attributes?.size_y}
                  </p>
                </span>
              )}

          {/* <div>
            {meta &&
              meta._metadata !== null && [
                typeof meta._metadata.attributes !== "undefined" && [
                  meta._metadata.attributes.length > 1 && [
                    meta._metadata.attributes[1].trait_type === "varient" && [
                      <div className="flex">
                        <code className="bg-tag px-2 rounded text-white mr-2">
                          {[meta._metadata.attributes[1].value]}
                        </code>

                        {[
                          meta._metadata.attributes[1].value.map(
                            (item, index) => {
                              return (
                                <code
                                  key={index}
                                  className="bg-tag px-2 rounded text-white mr-2"
                                >
                                  {item}
                                </code>
                              );
                            }
                          ),
                        ]}
                      </div>,
                    ],
                  ],
                ],
              ]}
          </div> */}
        </div>

        <div className="pt-2 flex justify-end items-end">
          {/* <div>
            <h3 className="font-medium text-gray-400 text-left">Sell Type :</h3>
            <p className="font-medium text-primary text-left text-bold">
              {meta ? meta.contract_type : "-"}
            </p>
          </div> */}

          {/* <div>
            <h3 className="font-medium text-gray-400 text-left">
              Total :{" "}
              <span className="text-primary text-bold">
                {meta ? meta.amount : "0"}
              </span>
            </h3>
            <p className="font-medium text-gray-400 text-left">
              Available :{" "}
              <span className="text-primary text-bold">
                {meta ? meta._available : "0"}
              </span>
            </p>
          </div> */}

          <button
            type="button"
            onClick={() => handleChangeAssetVisible(!assetVisible)}
          >
            <i className={`fas fa-${assetVisible ? "eye" : "eye-slash"}`} />
          </button>
        </div>
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
}

export default CardAssetOwner;
