import { useEffect, useState } from "react";
import { getAssetById } from "../../utils/api/asset-api";
import Config from "../../utils/config";
import { getWalletAddress } from "../../utils/wallet/connector";

const CardCollection = (props) => {
  const [meta, setMeta] = useState(null);

  const fetchImageBucket = (image) => {
    const url = `${Config.COLLECTION_API}/images/${image}`;
    return url;
  };

  const getAssetCollection = async (props) => {
    // console.log(props.meta);

    const _data = props.meta;

    const _asset = _data.assets;

    const _as = await _asset.map(async (item) => {
      const asset = await getAssetById(item);

      return asset;
    });

    const _a = await Promise.all(_as);

    const _d = {
      _data,
      _a,
    };
    // console.log(_d);
    setMeta(_d);
  };

  useEffect(() => {
    getAssetCollection(props);
  }, []);
  return (
    <>
      {meta &&
        typeof meta !== "undefined" && [
          <>
            <div className="collection-item">
              <div className="collection-haeder">
                <img
                  className="img-cover"
                  src={fetchImageBucket(meta._data.cover)}
                />
                <div className="collection-des">
                  <h4>{meta._data.title}</h4>
                  <p className="descinfo">{meta._data.description}</p>
                  <div className="owner">
                    {typeof meta._data.user !== "undefined" && [
                      <span className="name">
                        {getWalletAddress(meta._data.user.address)}
                      </span>,
                    ]}
                  </div>
                </div>
                <button className="btn btn-explore">EXPLORE</button>
              </div>
              <div className="collection-footer">
                <div className="colf-left">
                  <div className="img-colft img-colf-1">
                    <img
                      className="imgs"
                      src={
                        meta._a[0] && typeof meta._a[0] !== "undefined"
                          ? meta._a[0].image
                          : "/assets/image/no-image.jpg"
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/assets/image/no-image.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="colf-right">
                  <div className="colf-right-top">
                    <div className="colf-right-top-left">
                      <div className="img-colft img-colf-2">
                        <img
                          className="imgs"
                          src={
                            meta._a[1] && typeof meta._a[1] !== "undefined"
                              ? meta._a[1].image
                              : "/assets/image/no-image.jpg"
                          }
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "/assets/image/no-image.jpg";
                          }}
                        />
                      </div>
                    </div>
                    <div className="colf-right-top-right">
                      <div className="img-colft img-colf-3">
                        <img
                          className="imgs"
                          src={
                            meta._a[2] && typeof meta._a[2] !== "undefined"
                              ? meta._a[2].image
                              : "/assets/image/no-image.jpg"
                          }
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "/assets/image/no-image.jpg";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="colf-right-bottom">
                    <div className="img-colft img-colf-4">
                      <img
                        className="imgs"
                        src={
                          meta._a[3] && typeof meta._a[3] !== "undefined"
                            ? meta._a[3].image
                            : "/assets/image/no-image.jpg"
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "/assets/image/no-image.jpg";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>,
        ]}
    </>
  );
};

export default CardCollection;
