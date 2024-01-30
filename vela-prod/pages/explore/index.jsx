import { useEffect, useState, React } from "react";
// import { useMoralis } from "react-moralis";
import Config from "../../utils/config";

import { fetchABIWhitelist } from "../../utils/api/whitelist";

import {
  auctionContract,
  getMetadata,
  marketplaceContract,
  offerContract,
} from "../../utils/web3/init";
import { convertWeiToEther } from "../../utils/number";
import Accordion from "/components/Accordion";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import {
  getLandWithTokenId,
  getBaseLandURL,
  mapZoneByAddress,
} from "../../utils/web3/land";
import { getNFTUrl } from "../../utils/web3/nft";
import { abiAuction, abiMarketplace } from "../../utils/abis/main";
import { getTokenURI } from "../../utils/checkApprove";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const mouseUp = (name) => {
  document.querySelector("#sidebar-toggle").classList.toggle("hide");
};

const ExplorePage = () => {
  const [allList, setAllList] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marketList, setMarketList] = useState([]);
  const [auctionList, setAuctionList] = useState([]);
  const [priceName, setPriceName] = useState("Price All");
  const [enteredTag, setEnteredTag] = useState("");
  const [filterData, setFilterData] = useState({
    statusItem: {
      buy: false,
      auction: false,
      latest: false,
      hasOffer: false,
      isVerified: false,
    },
    tags: [],
    price: {
      status: false,
      token: "",
      min: 0,
      max: 0,
    },
    nftType: null,
  });

  const fetchMarketList = async () => {
    try {
      const data = await marketplaceContract.methods.getItems().call();

      let showDateStart = new Date();
      showDateStart.setDate(showDateStart.getDate());

      const listData = await data.filter((item) => {
        return (
          item._available === true &&
          new Date(item._expiration * 1000) >= showDateStart
        );
      });

      const _placeItem = listData.map(async (item) => {
        let owner = item._owner;
        let offers = await offerContract.methods.getOfferLists(owner).call();
        offers = offers.filter(
          (x) => parseInt(x._marketId) == parseInt(item._marketId)
        );
        //1 = ERC1155, 2 = ERC721
        // console.log("itemType : ", item._itemType)
        if (parseInt(item._itemType) && parseInt(item._itemType) === 1) {
          // const _collection = await itemContract.methods.getBaseUrl().call();
          // const _metadata = await getMetadata(
          //   `${_collection}/${item._tokenId}.json`
          // );
          // return [
          //   parseInt(item._amount),
          //   _metadata,
          //   item,
          //   "ERC1155",
          //   "SELL",
          //   offers,
          // ];
        } else if (parseInt(item._itemType) && parseInt(item._itemType) === 2) {
          const _data = await getTokenURI(item._item, item._tokenId);
          const _metadata = await getMetadata(_data);

          return [
            parseInt(item._amount),
            _metadata,
            item,
            "ERC721",
            "SELL",
            offers,
          ];
        } else {
          console.log("ERROR");
        }
      });

      const item = await Promise.all(_placeItem);
      // console.log("item", item);
      return item;
    } catch (error) {
      console.log("fetchMarketList error:", error);
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
        //1 = ERC1155, 2 = ERC721
        if (parseInt(item._itemType) && parseInt(item._itemType) === 1) {
          // const _collection = await itemContract.methods.getBaseUrl().call();
          // const _metadata = await getMetadata(
          //   `${_collection}/${item._tokenId}.json`
          // );
          // return [parseInt(item._amount), _metadata, item, "ERC1155", "BID"];
        } else if (parseInt(item._itemType) && parseInt(item._itemType) === 2) {
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

    try {
      const itemList = await fetchMarketList();
      const auctionList = await fetchBidItemList();

      // console.log("itemList", itemList);
      // console.log("auctionList", auctionList);

      let onlyAuction = await formatArray(auctionList, "BID");
      let onlyMarket = await formatArray(itemList, "SELL");

      setMarketList(onlyMarket);
      setAuctionList(onlyAuction);
      const allItem = onlyMarket.concat(onlyAuction);

      // console.log("onlyMarket", onlyMarket);
      // console.log("onlyAuction", onlyAuction);
      // console.log("allItem", allItem);

      if (allList.length === 0) {
        setAllList(allItem);
        setFinalData(allItem);
      }

      setLoading(false);
    } catch (error) {
      console.log("fetchAllPlacementList error", error);
    }
  };

  const setFormatData = () => {
    setLoading(false);
    let data = allList;

    if (filterData.statusItem.auction && filterData.statusItem.buy) {
      data = allList;
    } else if (filterData.statusItem.buy) {
      data = data.filter((x) => x.type == "SELL");
    } else if (filterData.statusItem.auction) {
      data = data.filter((x) => x.type == "BID");
    }

    if (filterData.statusItem.latest) {
      data = data.sort(
        (a, b) => parseFloat(a.expiration) - parseFloat(b.expiration)
      );
    }
    if (filterData.statusItem.hasOffer) {
      data = data.filter((x) => x.offers && x.offers.length > 0);
    }
    if (filterData.statusItem.isVerified) {
      data = data.filter((x) => x.is_verify);
    }
    if (filterData.price.token == "CLASS") {
      data = data.filter((x) => {
        // let price = convertHex(x.price_num);
        let price = x.price_num;
        return (
          x.data._token == Config.CLASS_TOKEN_ADDR &&
          price >= filterData.price.min &&
          price <= filterData.price.max
        );
      });
    } else if (filterData.price.token == "BUSD") {
      // data = data.filter((x) => {
      //   let price = x.data.price_num ? convertWeiToEther(x.data.price_num) : 0;
      //   price = parseFloat(price);
      //   return (
      //     x.data._token == Config.BUSD_TOKEN_ADDR &&
      //     price >= filterData.price.min &&
      //     price <= filterData.price.max
      //   );
      // });
    } else {
      if (filterData.price.min > 0 || filterData.price.max > 0) {
        data = data.filter((x) => {
          let price = x.price_num;
          return price >= filterData.price.min && price <= filterData.price.max;
        });
      }
    }

    if (filterData.tags.length) {
      data = data.filter((x) =>
        x.tags.some((tag) => filterData.tags.includes(tag))
      );
    }

    data.map((_d) => {
      const _map = mapZoneByAddress(_d["data"]["_item"]);

      _d.mapName = _map?.name;
      _d.mapZone = _map?.zone;
      _d.mapImage = _map?.image;
    });

    setFinalData(data);
    // setTimeout(()=>setLoading(false), 500);
  };

  const convertHex = (hex) => {
    let num = parseInt(hex, 16);
    return num.toLocaleString("fullwide", { useGrouping: false });
  };

  const formatArray = async (arr, type) => {
    // const landUri = await getBaseLandURL();

    const assets = [];
    await Promise.all(
      arr.map(async (element, index) => {
        // console.log("Element : ", element);
        let res = [];
        let metadata = element[1];
        let priceNum = element[2]._price;
        let expiration = element[2]._expiration;
        let priceEth = convertWeiToEther(priceNum);

        res["id"] = index;
        res["name"] = "My Land";
        res["type"] = type;
        res["location"] = ""; // need to implement
        res["expiration"] = expiration;
        res["offers"] = element[5];
        res["data"] = element[2];

        const token_id = element[2]._tokenId;
        res["token_id"] = token_id;

        if (metadata?.attributes) {
          let url = `${Config.COLLECTION_API}/assets/${element[2]._item}/${element[2]._tokenId}`;
          let assetData = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          });

          let data = (await assetData.json())[0];
          res["is_verify"] = data && data.verify === "Y" ? true : false;
          res["size_x"] = metadata.attributes.size_x;
          res["size_y"] = metadata.attributes.size_y;
          res["tags"] = Array.isArray(data?.tags) ? data.tags : [];
          res["visible"] =
            typeof data?.visible === "boolean" ? data?.visible : true;
        }
        // let uri = await getBaseLandURL();

        if (
          element[2]._item.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()
        ) {
          res["name"] = element[1].name;
          res["imageSrc"] = element[1].image_cdn;
        } else {
          let locate = await getLandWithTokenId(
            element[2]._tokenId,
            element[2]._item
          );

          res["location"] = locate["x"] + ", " + locate["y"];

          const _metadata = element[1];
          if (_metadata) {
            res["name"] = _metadata.name;
            res["imageSrc"] = _metadata.image;
          }
        }

        res[
          "href"
        ] = `/placements/${element[2]._item}/${element[2]._tokenId}/${element[2]._amount}/${element[2]._owner}`;
        res["price"] = priceEth.toLocaleString();
        res["price_num"] = parseFloat(priceEth);
        // res["imageSrc"] = element[1];
        res["imageAlt"] = "LAND ALT";

        const _mapZone = mapZoneByAddress(res.data._item);

        res["mapName"] = _mapZone?.name;
        res["mapZone"] = _mapZone?.zone;
        res["mapImage"] = _mapZone?.image;

        // if (res["visible"]) {
        assets.push(res);
        // }

        // return res;
      })
    );
    return assets;
  };

  const handleChangeTag = (e) => {
    setEnteredTag(e.target.value);
  };

  const handlePressToSelectTag = (e) => {
    if (e.key === "Enter") {
      setFilterData((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, enteredTag.trim()],
      }));
      setEnteredTag("");
    }
  };

  const handleRemoveEnteredTag = (selectedIndex) => {
    setFilterData((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag, index) => index !== selectedIndex),
    }));
  };

  useEffect(() => {
    setFormatData();
  }, [filterData.tags]);

  useEffect(() => {
    fetchAllPlacementList();
  }, []);

  if (!allList) {
    return null;
  }

  return (
    <>
      <div className="heading">
        <h2>Marketplace</h2>
        <p>
          {/* Here you can search and buy creator&apos;s ASSETS with SAND to incorporate
          them into your LAND */}
          Here you can search and buy creator&apos;s ASSETS with CLASS to
          incorporate them into your LAND
        </p>
      </div>
      <section className="vela-full-sidebar" id="sidebar-toggle">
        <div className="sidebar">
          <div className="sidebar-toggler" onMouseUp={() => mouseUp()}>
            <div className="toggle-title">
              <i className="far fa-filter"></i>Filter
            </div>
            <div className="toggle-arrow">
              <i className="fas fa-arrow-to-left"></i>
            </div>
          </div>
          <Accordion allowMultipleOpen>
            <div label="STATUS" isOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="btn-checkbox">
                  <input
                    type="checkbox"
                    id="buynow"
                    disabled={loading}
                    onChange={(e) => {
                      filterData.statusItem.buy = e.target.checked;
                      setFormatData();
                    }}
                  />
                  <label className="btn-checkbox" htmlFor="buynow">
                    On sell
                  </label>
                </div>
                <div className="btn-checkbox">
                  <input
                    type="checkbox"
                    id="auction"
                    disabled={loading}
                    onChange={(e) => {
                      filterData.statusItem.auction = e.target.checked;
                      setFormatData();
                    }}
                  />
                  <label className="btn-checkbox" htmlFor="auction">
                    On Auction
                  </label>
                </div>
                <div className="btn-checkbox">
                  <input
                    type="checkbox"
                    id="new"
                    disabled={loading}
                    onChange={(e) => {
                      filterData.statusItem.latest = e.target.checked;
                      setFormatData();
                    }}
                  />
                  <label className="btn-checkbox" htmlFor="new">
                    New
                  </label>
                </div>
                <div className="btn-checkbox">
                  <input
                    type="checkbox"
                    id="offers"
                    disabled={loading}
                    onChange={(e) => {
                      filterData.statusItem.hasOffer = e.target.checked;
                      setFormatData();
                    }}
                  />
                  <label className="btn-checkbox" htmlFor="offers">
                    Has Offers
                  </label>
                </div>
                <div className="btn-checkbox">
                  <input
                    type="checkbox"
                    id="isVerified"
                    disabled={loading}
                    onChange={(e) => {
                      filterData.statusItem.isVerified = e.target.checked;
                      setFormatData();
                    }}
                  />
                  <label className="btn-checkbox" htmlFor="isVerified">
                    Verified
                  </label>
                </div>
              </div>
            </div>

            <div label="TAG" isOpen>
              <div className="grid">
                <input
                  type="text"
                  className="form-control"
                  value={enteredTag}
                  onKeyPress={handlePressToSelectTag}
                  onChange={handleChangeTag}
                  placeholder="Tag"
                />
                <div
                  className={`mt-${
                    filterData.tags.length ? "4" : "0"
                  } tag-badge-container`}
                >
                  {filterData.tags.map((tag, index) => (
                    <span
                      className="tag-badge cursor-pointer"
                      onClick={() => handleRemoveEnteredTag(index)}
                      key={`Tag-${index}`}
                    >
                      <i className="fas fa-times mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div label="Price" isOpen>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div>
                    <Menu
                      as="div"
                      className="relative inline-block text-left w-full"
                    >
                      <div>
                        <Menu.Button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 focus:outline-none select-search">
                          {priceName}
                          <ChevronDownIcon
                            className="-mr-1 ml-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="z-50  absolute mt-2 w-56 rounded-md shadow-lg text-white focus:outline-none select-option">
                          <div className="py-1">
                            {/* <Menu.Item>
                              {({ active }) => (
                                <a
                                  className={classNames(
                                    active
                                      ? "bg-dropdown-hover text-white"
                                      : "text-white",
                                    "block px-4 py-2 text-sm"
                                  )}
                                  disabled={loading}
                                  onClick={(e) => {
                                    filterData.price.status = false;
                                    filterData.price.token = "";
                                    setPriceName("Price All");
                                    // setFormatData();
                                  }}
                                >
                                  Price (ETH)
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  className={classNames(
                                    active
                                      ? "bg-dropdown-hover text-white"
                                      : "text-white",
                                    "block px-4 py-2 text-sm"
                                  )}
                                  disabled={loading}
                                  onClick={(e) => {
                                    filterData.price.status = true;
                                    filterData.price.token = "BUSD";
                                    setPriceName("BUSD");
                                    // setFormatData();
                                  }}
                                >
                                  United States Dollar (USD)
                                </a>
                              )}
                            </Menu.Item> */}
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  className={classNames(
                                    active
                                      ? "bg-dropdown-hover text-white"
                                      : "text-white",
                                    "block px-4 py-2 text-sm"
                                  )}
                                  disabled={loading}
                                  onClick={(e) => {
                                    filterData.price.status = true;
                                    filterData.price.token = "CLASS";
                                    setPriceName("CLASS");
                                    // setFormatData();
                                  }}
                                >
                                  Class Coin (CLASS)
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    min="0"
                    disabled={loading}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      } else {
                        filterData.price.min = e.target.value;
                      }
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    min="0"
                    disabled={loading}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      } else {
                        filterData.price.max = e.target.value;
                      }
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <button
                    className="form-control"
                    disabled={loading}
                    onClick={(e) => {
                      setFormatData();
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
            {/* <div label="NFT TYPE" isOpen>
              <div className="btn-checkbox mb-2">
                <input type="checkbox" id="lands" />
                <label className="btn-checkbox" htmlFor="lands">
                  Lands
                </label>
              </div>
              <div className="btn-checkbox mb-2">
                <input type="checkbox" id="buildings" />
                <label className="btn-checkbox" htmlFor="buildings">
                  Buildings
                </label>
              </div>
              <div className="btn-checkbox mb-2">
                <input type="checkbox" id="assets" />
                <label className="btn-checkbox" htmlFor="assets">
                  Assets
                </label>
              </div>
            </div> */}
            {/* <div label="CHAINS" isOpen>
              <div className="btn-checkbox mb-2">
                <input type="checkbox" id="velaverse" />
                <label className="btn-checkbox" htmlFor="velaverse">
                  Velaverse
                </label>
              </div>
              <div className="btn-checkbox mb-2">
                <input type="checkbox" id="classcoin" />
                <label className="btn-checkbox" htmlFor="classcoin">
                  Classcoin
                </label>
              </div>
              <div className="btn-checkbox mb-2">
                <input type="checkbox" id="ethereum" />
                <label className="btn-checkbox" htmlFor="ethereum">
                  Ethereum
                </label>
              </div>
            </div> */}
          </Accordion>
        </div>
        <div className="content">
          {/* searh-sort-section */}
          {/*
          <div className="searh-sort-section mb-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative w-full col-span-2 lg:col-span-2">
              <input
                className="input-search form-control"
                type="text"
                placeholder="Search"
              />
              <i
                className="fa fa-search absolute icon-search"
                aria-hidden="true"
              ></i>
            </div>
            <div className="relative w-full col-span-1 lg:col-span-1">
              <Menu
                as="div"
                className="relative inline-block text-left w-full "
              >
                <div>
                  <Menu.Button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 focus:outline-none select-search">
                    Single items
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg text-white focus:outline-none select-option">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-800 text-white" : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            All items
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-800 text-white" : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Bundles
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="relative w-full col-span-1 lg:col-span-1">
              <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                  <Menu.Button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-gray-50 focus:outline-none select-search">
                    Sort by
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-50  absolute mt-2 w-56 rounded-md shadow-lg text-white focus:outline-none select-option">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Recently Listed
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Recently Created
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Recently Sold
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Recently Received
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Ending soon
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Price: Low to High
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Price: High lo Low
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Highest Last Sale
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Most Viewed
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-dropdown-hover text-white"
                                : "text-white",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Oldest
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          */}
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
          <div className="card-product-fullwidth">
            {finalData.map((product, index) => (
              <div className="card-item" key={index}>
                <div className="product-img-cover">
                  <img
                    src={
                      typeof product.mapImage !== "undefined"
                        ? product.mapImage
                        : "/assets/image/no-image.jpg"
                    }
                    // src={
                    //   typeof product.imageSrc !== "undefined"
                    //     ? product.imageSrc
                    //     : "/assets/image/no-image.jpg"
                    // }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/assets/image/no-image.jpg";
                    }}
                    alt={product.imageAlt}
                    className="product-img"
                  />
                  <div className="tag-type">{product.type}</div>
                  <a key={product.id} href={product.href} className="bid-btn">
                    Detail
                  </a>
                </div>
                {product.is_verify && (
                  <div className="tag-verify primary">Verified</div>
                )}

                <div>{product?.mapZone.toUpperCase() || product?.name}</div>
                <div>Token Id: #{product.token_id}</div>

                {product.location !== "" && (
                  <p className="product-location">
                    <i className="fas fa-map-marker-alt"></i> {product.location}
                  </p>
                )}
                {product.size_x && product.size_y && (
                  <p className="product">
                    <i className="fa-solid fa-magnifying-glass">
                      Building Size : {product.size_x + " x " + product.size_y}
                    </i>
                  </p>
                )}
                <p className="product-price">{product.price}</p>
                {Array.isArray(product?.tags) && (
                  <div className="tag-badge-container mt-4">
                    {product.tags.slice(0, 3).map((nftTag, idx) => (
                      <span className="tag-badge" key={`${nftTag}-${idx}`}>
                        {nftTag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExplorePage;
