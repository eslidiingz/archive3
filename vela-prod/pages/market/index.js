import { useEffect, useState, React } from "react";
// import { useMoralis } from "react-moralis";

import Config from "../../utils/config";

import { fetchABIWhitelist } from "../../utils/api/whitelist";

import {
  auctionContract,
  getMetadata,
  marketplaceContract,
  web3,
} from "../../utils/web3/init";
import { convertWeiToEther } from "../../utils/number";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { getBaseLandURL, getLandWithTokenId } from "../../utils/web3/land";
import { cmAssets, getNFTUrl } from "../../utils/web3/nft";
import { abiAuction, abiMarketplace } from "../../utils/abis/main";
import { cmLand, getTokenURI } from "../../utils/checkApprove";
import Slider from "react-slick";
const MarketListPage = () => {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1279,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  var collectionSlider = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const products = [
    {
      id: 1,
      name: "Earthen Bottle",
      location: "-80,-166",
      href: "#",
      price: "$48",
      imageSrc: "/assets/image/items/asset_land.png",
      imageAlt:
        "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
    },
    {
      id: 2,
      name: "Nomad Tumbler",
      location: "-80,-166",
      href: "#",
      price: "$35",
      imageSrc: "/assets/image/items/Class-BanKoh_4x4.png",
      imageAlt:
        "Olive drab green insulated bottle with flared screw lid and flat top.",
    },
    {
      id: 3,
      name: "Focus Paper Refill",
      location: "-80,-166",
      href: "#",
      price: "89 Class",
      imageSrc: "/assets/image/items/House-01_2x2.png",
      imageAlt:
        "Person using a pen to cross a task off a productivity paper card.",
    },
    {
      id: 4,
      name: "Machined Mechanical Pencil",
      location: "-80,-166",
      href: "#",
      price: "35 Class",
      imageSrc: "/assets/image/items/House-02_2x2.png",
      imageAlt:
        "Hand holding black machined steel mechanical pencil with brass tip and top.",
    },
    {
      id: 1,
      name: "Earthen Bottle",
      location: "-80,-166",
      href: "#",
      price: "48 Class",
      imageSrc: "/assets/image/items/House-03_2x2.png",
      imageAlt:
        "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
    },
    {
      id: 2,
      name: "Nomad Tumbler",
      location: "-80,-166",
      href: "#",
      price: "34 Class",
      imageSrc: "/assets/image/items/House-04_2x2.png",
      imageAlt:
        "Olive drab green insulated bottle with flared screw lid and flat top.",
    },
    {
      id: 3,
      name: "Focus Paper Refill",
      location: "-80,-166",
      href: "#",
      price: "$69 Class",
      imageSrc: "/assets/image/items/House-05_2x2.png",
      imageAlt:
        "Person using a pen to cross a task off a productivity paper card.",
    },
    {
      id: 4,
      name: "Machined Mechanical Pencil",
      location: "-80,-166",
      href: "#",
      price: "54 Class",
      imageSrc: "/assets/image/items/Tower-05_3x3.png",
      imageAlt:
        "Hand holding black machined steel mechanical pencil with brass tip and top.",
    },
    // More products...
  ];

  // const { Moralis } = useMoralis();
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marketList, setMarketList] = useState([]);
  const [auctionList, setAuctionList] = useState([]);
  const fetchMarketList = async () => {
    try {
      const data = await marketplaceContract.methods.getItems().call();
      // console.log(data);

      let showDateStart = new Date();
      showDateStart.setDate(showDateStart.getDate());

      const listData = await data.filter((item) => {
        return (
          item._available === true &&
          new Date(item._expiration * 1000) >= showDateStart
        );
      });
      const _placeItem = listData.map(async (item) => {
        if (item._itemType === "2") {
          let contract;
          if (item._item.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()) {
            contract = cmAssets;
          } else if (
            item._item.toLowerCase() === Config.LAND_ADDR.toLowerCase()
          ) {
            contract = cmLand;
          }

          const _data = await contract.methods
            .tokenURI(BigInt(item._tokenId))
            .call();
          const _metadata = await getMetadata(_data);

          return [parseInt(item._amount), _metadata, item, "ERC721", "SELL"];
        }
      }); 

      const item = await Promise.all(_placeItem);

      return item;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBidItemList = async () => {
    try {
      const data = await auctionContract.methods.getAllAuction().call();
      let showDateStart = new Date();
      showDateStart.setDate(showDateStart.getDate());

      const listData = await data.filter((item) => {
        return (
          item._available === true &&
          new Date(item._expiration * 1000) >= showDateStart
        );
      });
      const _placeItem = listData.map(async (item) => {
        if (item._itemType === "2") {
          const _data = await getTokenURI(item._item, item._tokenId);

          const _metadata = await getMetadata(_data);
          return [parseInt(item._amount), _metadata, item, "ERC721", "BID"];
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
    const itemList = (await fetchMarketList()) ?? [];

    const auctionsList = (await fetchBidItemList()) ?? [];
    itemList.sort((a, b) => a[2]._expiration - b[2]._expiration);
    auctionsList.sort((a, b) => a[2]._expiration - b[2]._expiration);
    const onlyMarket = await formatArray(itemList);
    const onlyAuction = await formatArray(auctionsList);

    setMarketList(onlyMarket);
    setAuctionList(onlyAuction);
    const allItem = itemList.concat(auctionsList);
    allItem.sort(function (a, b) {
      return a[2]._expiration - b[2]._expiration;
    });
    if (allList.length === 0) {
      setAllList(allItem);
    }

    setLoading(false);
  };

  const formatArray = async (arr) => {
    arr = arr.map(async (element, index) => {
      if (element !== undefined) {
        let res = [];
        let metadata = element[1]
        let priceEth = convertWeiToEther(element[2]._price);
        res["id"] = index;
        res["name"] = "Untitle";
        res["location"] = "";
        res['size_x'], res['size_y'] = null, null
        res['is_verify'] = null
        if(metadata.attributes){
          let url = `https://collection.velaverse.io/api/v1/assets/${element[2]._item}/${element[2]._tokenId}`
          let assetData = await fetch(url, {
            method: "GET",
            mode: 'cors',
            headers: {
              'Content-Type' : 'application/json'
            }
          })
          let data = (await assetData.json())[0]
          res['is_verify'] = (data && data.verify === "Y") ? true : false
          res['size_x'] = metadata.attributes.size_x
          res['size_y'] = metadata.attributes.size_y
        }
        
        res["expiration"] = element[2]._expiration;
        const token_id = parseInt(element[2]._tokenId);

        res["token_id"] = token_id;
        if (element[2]._item.toLowerCase() === Config.LAND_ADDR.toLowerCase()) {
          let locate = await getLandWithTokenId(token_id);
          res["location"] = locate["x"] + ", " + locate["y"];
          const landUri = await getBaseLandURL();
          const _metadata = await getMetadata(landUri);

          res["name"] = _metadata.name;
          res["imageSrc"] = _metadata.image;
        } else if (
          element[2]._item.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()
        ) {
          const url = await getNFTUrl(token_id);
          const _metadata = await getMetadata(url);
          if (_metadata) {
            res["name"] = _metadata.name;
            res["imageSrc"] = _metadata.image_cdn;
          }
        }
        res[
          "href"
        ] = `/placements/${element[2]._item}/${element[2]._tokenId}/${element[2]._amount}/${element[2]._owner}`;
        res["price"] = priceEth.toLocaleString();
        res["imageAlt"] = "LAND ALT";
        return res;
      } else {
        return [];
      }
    });

    return await Promise.all(arr);
  };

  useEffect(() => {
    fetchAllPlacementList();
  }, []);

  if (!allList) {
    return null;
  }

  return (
    <div>
      <div className="max-screen-theme mx-auto py-16 px-4 sm:py-24 sm:px-6 md:py lg:px-0 lg:flex lg:justify-between flex flex-col lg:flex-row relative">
        <div className="max-w-xl flex flex-col justify-center px-5 sm:px-10 lg:px-0">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl sm:tracking-tight lg:text-5xl header-text-market lg:mb-4 ">
            NFT Market
          </h2>
          <p className="mt-5 mb-5 text-xl header-text-market2">
            {/* Start building for free, then add a site plan to go live. Account
            plans unlock additional features. */}
            Start trading on new world, trade on Velaverse.
          </p>
          <div className="flex flex-row md:w-64 lg:w-40 mt-5">
            <button
              className="btn-header mr-2 "
              onClick={() => (window.location = "/explore")}
            >
              Explore{" "}
            </button>
            {/* <button
              className="btn-header"
              onClick={() => (window.location = "/profile/mynft")}
            >
              Create{" "}
            </button> */}
          </div>
        </div>
        {/* <div className="mt-10 w-full max-w-xs mx-auto"> */}
        <div className="homme2">
          <img
            src={"/assets/image/items/land-2.png"}
            alt=""
            className="m-auto"
            width="80%"
          />
          {/* <div className="cloud2"> */}
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud1"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud2"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud3"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud4"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud5"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud6"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud7"
          />
          <img
            src={"/assets/image/items/cloud.png"}
            alt=""
            className="cloud8"
          />
          {/* </div> */}
        </div>
      </div>
      <section className="vela-fluid">
        <div className="content">
          <div className="heading-section">
            <h2>Live Auctions</h2>
            <Link href={"/explore"}>
              <a href="">EXPLORE MORE</a>
            </Link>
          </div>
          <div>
            <Slider {...settings}>
              {loading && (
                <div className="loader-page" align="center">
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
              )}
              {auctionList.map((product, index) => {
                return (
                  <div className="card-item" key={index}>
                    <div className="product-img-cover">
                      <img
                        src={
                          typeof product.imageSrc !== "undefined"
                            ? product.imageSrc
                            : "/assets/image/no-image.jpg"
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "/assets/image/no-image.jpg";
                        }}
                        alt={product.imageAlt}
                        className="product-img"
                      />
                      <div className="tag-type">Bid</div>
                      <a
                        key={product.id}
                        href={product.href}
                        className="bid-btn"
                      >
                        Place Bid
                      </a>
                    </div>
                    {product.is_verify && <div className="tag-verify">Verified</div>}
                    <h3 className="product-name">
                      {product.name} #{product.token_id}
                    </h3>
                    {product.location !== "" && (
                      <p className="product-location">
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {product.location}
                      </p>
                    )}
                    {product.size_x && product.size_y && (
                      <p className="product">
                        <i className="fa-solid fa-magnifying-glass">Building Size : {product.size_x + ", " + product.size_y}</i>
                      </p>
                    )}

                    <p className="product-price">{product.price}</p>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </section>

      <section className="vela-fluid">
        <div className="content">
          <div className="heading-section">
            <h2>Today&apos;s Picks</h2>
            <Link href={"/explore"}>
              <a href="">EXPLORE MORE</a>
            </Link>
          </div>
          {loading && (
            <div className="loader-page" align="center">
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
          )}
          <div className="card-product">
            {marketList.map((product, index) => (
              <div className="card-item" key={index}>
                <div className="product-img-cover">
                  <img
                    src={
                      typeof product.imageSrc !== "undefined"
                        ? product.imageSrc
                        : "/assets/image/no-image.jpg"
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/assets/image/no-image.jpg";
                    }}
                    alt={product.imageAlt}
                    className="product-img"
                  />
                  <div className="tag-type">Sell</div>
                  <a key={product.id} href={product.href} className="bid-btn">
                    Buy
                  </a>
                </div>
                {product.is_verify && <div className="tag-verify">Verified</div>}
                <h3 className="product-name">
                  {product.name} #{product.token_id}
                </h3>
                {product.location !== "" && (
                  <p className="product-location">
                    <i className="fas fa-map-marker-alt"></i> {product.location}
                  </p>
                )}
                {product.size_x && product.size_y && (
                  <p className="product">
                    <i className="fa-solid fa-magnifying-glass">Building Size : {product.size_x + " x " + product.size_y}</i>
                  </p>
                )}

                <p className="product-price">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="vela-fluid">
        <div className="content">
          <div className="heading-section">
            <h2>Popular Collection</h2>
            <Link href={"/explore"}>
              <a href="">EXPLORE MORE</a>
            </Link>
          </div>
          <div>
            <Slider {...collectionSlider}>
              {products.map((product, index) => (
                <div className="card-item" key={index}>
                  <div className="sc-card-collection style-2 home2">
                    <div className="card-bottom">
                      <div className="author">
                        <div className="sc-author-box style-2">
                          <div className="author-avatar">
                            <img
                              src={"/assets/image/collection/avt-8.jpg"}
                              alt=""
                              className="avatar"
                            />
                          </div>
                        </div>
                        <div className="text-left">
                          <h4>{product.name}</h4>
                          <div className="infor">
                            <span>Created by</span>
                            <span className="name">Velaverse</span>
                          </div>
                        </div>
                        <button className="btn btn-explore ml-auto">
                          EXPLORE
                        </button>
                      </div>
                    </div>
                    <div className="media-images-collection">
                      <div className="box-left">
                        <img src={product.imageSrc} alt="" />
                      </div>
                      <div className="box-right">
                        <div className="top-img">
                          <img
                            src={
                              "/assets/image/collection/img-collection18.jpg"
                            }
                            alt=""
                          />
                          <img
                            src={
                              "/assets/image/collection/img-collection25.jpg"
                            }
                            alt=""
                          />
                        </div>
                        <div className="bottom-img">
                          <img
                            src={
                              "/assets/image/collection/img-collection17.jpg"
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section> */}
    </div>
  );
};
export default MarketListPage;
