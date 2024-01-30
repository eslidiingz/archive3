import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAssetById } from "../../utils/api/asset-api";
import Config from "../../utils/config";
import { getMetadata, marketplaceContract } from "../../utils/web3/init";
import { smLand } from "../../utils/web3/land";
import { cmBuilding } from "../../utils/checkApprove";

const CardCollectionDetail = (props) => {
  const router = useRouter();
  const [data, setData] = useState(null);


  const fetchAssetsById = async (props) => {
    const asset = await getAssetById(props.data);

    const meta = await getMetadata(asset.metadata);

    const _address = asset.address.toLowerCase();

    var owner = "";
    if (_address === Config.LAND_ADDR.toLowerCase()) {
      owner = await smLand.methods.ownerOf(asset.token).call();
    } else if (_address === Config.GENNFT_ADDR.toLowerCase()) {
      owner = await cmBuilding.methods.ownerOf(asset.token).call();
    }

    const data = { ...meta, ...asset, owner };

    const marketDetail = await checkMarketId(data);

    data.detailLink = marketDetail ? `/placements/${data?.address}/${data?.token}/${1}/${data?.owner}` : `/nft-detail/${data?.address}/${data?.token}/${1}/${data?.owner}`;

    setData(data);
  };

  const checkMarketId = async (assetData) => {
    try {
      const marketId = await marketplaceContract.methods
        .getMarketId(assetData?.address, assetData?.owner, assetData?.token, 1, true)
        .call();

        return marketId?.[0] ? true : false;
    } catch (err){
      return false;
    }
  };

  const initialize = async () => {
    const assetData = await fetchAssetsById(props);
  };

  useEffect(() => {

    initialize();
    
  }, [props]);
  console.log(data)

  return (
    <Link href={data?.detailLink || ''}>
      <a target="_blank">
        <div className="card-item cursor-pointer" >
          <div className="product-img-cover">
            <img
              className="product-img"
              src={
                data && typeof data !== "undefined"
                  ? data.image
                  : "/assets/image/no-image.jpg"
              }
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "/assets/image/no-image.jpg";
              }}
            />

            <div className="tag-type">Sell</div>

            {/* <Link
            href={
              data && typeof data !== "undefined"
                ? `/placements/${data.address}/${data.token}/1/${data.owner}`
                : "#"
            }
          >
            <a className="bid-btn">Detail</a>
          </Link> */}
          </div>
          {data && [
            data.verify !== "" && [
              data.verify !== "N" && [
                data.verify === "Y" && <div className="tag-verify">Verified</div>,
              ],
            ],
          ]}

          <h3 className="product-name">
            {data && typeof data !== "undefined" ? data.name : "-"}
          </h3>
          {/* <p className="product-location">
          <i className="fas fa-map-marker-alt"></i> {56, 181}
        </p>
        <p className="product-price">88</p> */}
          <div>
            <h3 className="font-medium">Token ID : {data?.token}</h3>
            {data &&
              JSON.stringify(data.attributes) !== "{}" &&
              typeof data.attributes !== "undefined" && [
                <div>
                  <h3 className="font-medium text-gray-400 text-left">
                    Floor Width :{" "}
                    <span className="text-primary text-bold">
                      {typeof data.attributes.size_x !== "undefined"
                        ? data.attributes.size_x
                        : 0}{" "}
                      (Blocks)
                    </span>
                  </h3>
                  <h3 className="font-medium text-gray-400 text-left">
                    Floor Length :{" "}
                    <span className="text-primary text-bold">
                      {typeof data.attributes.size_y !== "undefined"
                        ? data.attributes.size_y
                        : 0}{" "}
                      (Blocks)
                    </span>
                  </h3>
                </div>,
              ]}
          </div>
        </div>

        {/* <div className="relative card-item-collection">
        <div className="relative overflow-hidden item-collection-inset">
          <div className="overlay-btn transition-all duration-300">
            {Config.OPEN_PROCESS && [
              data &&
                typeof data.attributes !== "undefined" && [
                  <>
                    <Link
                      href={`/placements/${data.address}/${data.token}/1/${data.owner}`}
                    >
                      <a target="_blank">
                        <button className="btn-buybid bg-detail font-bold py-2 px-4 rounded-full text-white">
                          Detail
                        </button>
                      </a>
                    </Link>
                  </>,
                ],
            ]}
          </div>

          <div className="card-listing-des cursor-pointer">
            <div></div>
          </div>
          <img
            className="object-center object-cover cursor-pointer img-ratio"
            src={
              data && typeof data !== "undefined"
                ? data.image
                : "/assets/image/no-image.jpg"
            }
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "/assets/image/no-image.jpg";
            }}
          />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="card-buybid-title">
          {data && [
            data.verify !== "" && [
              data.verify !== "N" && [data.verify === "Y" && ["Verified"]],
            ],
          ]}
        </h3>
      </div>
      <div className="mt-2">
        <h3 className="card-buybid-title">
          {data && typeof data !== "undefined" ? data.name : "-"}
        </h3>
      </div>
      <div className="pt-2 flex justify-between items-end">
          {data && typeof data.attributes !== "undefined" && [
            <div>
              <h3 className="font-medium text-gray-400 text-left">
                Floor Width :{" "}
                <span className="text-primary text-bold">
                  {typeof data.attributes.size_x !== "undefined"
                    ? data.attributes.size_x
                    : 0}{" "}
                  (Blocks)
                </span>
              </h3>
              <h3 className="font-medium text-gray-400 text-left">
                Floor Length :{" "}
                <span className="text-primary text-bold">
                  {typeof data.attributes.size_y !== "undefined"
                    ? data.attributes.size_y
                    : 0}{" "}
                  (Blocks)
                </span>
              </h3>
            </div>,
          ]}
      </div> */}
      </a>
    </Link>
  );
};

export default CardCollectionDetail;
