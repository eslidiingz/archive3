import { useEffect, useState } from "react";

import ReactPaginate from "react-paginate-next";
import CardBuyBid from "../../../components/collections/card-buybid";
import {
  auctionContract,
  getMetadata,
  getWalletAccount,
  marketplaceContract,
  offerContract,
} from "../../../utils/web3/init";
import Config from "../../../utils/config";
import Accordion from "/components/Accordion";
import {
  getLandWithTokenId,
  smLand as cmLand,
  smLand,
  smLandFn,
} from "../../../utils/web3/land";
import { cmAssets } from "../../../utils/web3/nft";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { convertWeiToEther } from "../../../utils/number";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const mouseUp = (name) => {
  document.querySelector("#sidebar-toggle").classList.toggle("hide");
};

const MyAssetOwner = () => {
  // const { Moralis } = useMoralis();
  // const { account } = useMoralisWeb3Api();
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalData, setFinalData] = useState([]);
  const [priceName, setPriceName] = useState("Price");
  const [amountItem, setAmountItem] = useState(20);
  const [itemPerPage, setItemPerPage] = useState(15);
  const [filterData, setFilterData] = useState({
    statusItem: {
      buy: false,
      auction: false,
      list: false,
      hasOffer: false,
    },
    price: {
      status: false,
      token: "",
      min: 0,
      max: 0,
    },
    nftType: null,
  });

  function setFormatData() {
    setLoading(true);

    let data = allList;

    if (
      (filterData.statusItem.auction && filterData.statusItem.buy) ||
      (!filterData.statusItem.auction && !filterData.statusItem.buy)
    ) {
      data = allList;
    } else if (filterData.statusItem.buy) {
      data = data.filter((x) => x.list == "market");
    } else if (filterData.statusItem.auction) {
      data = data.filter((x) => x.list == "auction");
    }

    if (filterData.statusItem.list == "hold") {
      // console.log("HOLD");
      data = data.filter((x) => {
        return x.status == false;
      });
    }
    if (filterData.statusItem.hasOffer) {
      // console.log("HAS OFFER");
      data = data.filter((x) => {
        return x.offers && x.offers > 0;
      });
    }
    if (filterData.price.status) {
      if (filterData.price.token == "CLASS") {
        data = data.filter((x) => x.data.length != 0);
        data = data.filter((x) => {
          let price = x.data._price ? convertWeiToEther(x.data._price) : 0;
          price = parseFloat(price);
          return (
            x.data._token == Config.CLASS_TOKEN_ADDR &&
            price >= filterData.price.min &&
            price <= filterData.price.max
          );
        });
      } else if (filterData.price.token == "BUSD") {
        // data = data.filter((x) => {
        //   let price = x.data._price ? convertWeiToEther(x.data._price) : 0;
        //   price = parseFloat(price);
        //   return (
        //     x.data._token == Config.BUSD_TOKEN_ADDR &&
        //     price >= filterData.price.min &&
        //     price <= filterData.price.max
        //   );
        // });
      } else {
        if (filterData.price.min > 0 || filterData.price.max > 0) {
        }
      }
    }

    setFinalData(data);
    setTimeout(() => setLoading(false), 500);
  }
  const checkPlacementAmount = async (
    marketList,
    auctionList,
    item,
    token,
    owner
  ) => {
    const _item = item.toLowerCase();
    const _token = token.toString();
    const _owner = owner.toLowerCase();
    let findInMarket = marketList.filter((item) => {
      return (
        item._available === true &&
        item._item.toLowerCase() === _item &&
        item._owner.toLowerCase() === _owner &&
        item._tokenId.toString() === _token
      );
    });
    if (findInMarket.length >= 1) {
      let offersData = await offerContract.methods.getOfferLists(owner).call();
      return {
        status: true,
        list: "market",
        amount: findInMarket.length,
        offers: offersData.length,
        data: findInMarket[0],
      };
    }
    let findInAuction = auctionList.filter((item) => {
      return (
        item._available === true &&
        item._item.toLowerCase() === _item &&
        item._owner.toLowerCase() === _owner &&
        item._tokenId.toString() === _token
      );
    });
    if (findInAuction.length >= 1)
      return {
        status: true,
        list: "auction",
        amount: findInAuction.length,
        offers: 0,
        data: findInAuction[0],
      };
    return { status: false, list: "hold", amount: 0, offers: 0, data: [] };
  };

  const fetchOwnerAsset = async (page = 0) => {
    // try {
    setLoading(true);
    const owner = await getWalletAccount();

    const _eventLand = await cmLand.methods.getTokensByOwner(owner).call();

    const _myLand = await _eventLand.map(async (item) => {
      var url = await cmLand.methods.tokenURI(item).call();
      var n = url.lastIndexOf("/");
      var result = url.substring(n + 1);

      url = "https://ipfs.velaverse.io/ipfs/" + result;

      const location = await getLandWithTokenId(item);
      const metadata = await getMetadata(url);
      return {
        item,
        token_id: item,
        location: location,
        metadata: metadata,
        token_address: Config.LAND_ADDR,
        owner_of: owner,
        type: "land",
      };
    });

    const _eventLandSut = await smLandFn(Config.LAND_SUT_ADDR)
      .methods.getTokensByOwner(owner)
      .call();

    const _myLandSUT = await _eventLandSut.map(async (item) => {
      var url = await smLandFn(Config.LAND_SUT_ADDR)
        .methods.tokenURI(item)
        .call();

      var n = url.lastIndexOf("/");
      var result = url.substring(n + 1);

      url = "https://ipfs.velaverse.io/ipfs/" + result;

      const location = await getLandWithTokenId(item, Config.LAND_SUT_ADDR);
      var metadata = await getMetadata(url);

      if (metadata) {
        metadata.image_cdn =
          "https://cdn.velaverse.io/getdata/asset-land-sut.svg";
      }

      return {
        item,
        token_id: item,
        location: location,
        metadata: metadata,
        token_address: Config.LAND_SUT_ADDR,
        owner_of: owner,
        type: "land",
      };
    });

    const _eventLandOldtown = await smLandFn(Config.LAND_OLD_TOWN_ADDR)
      .methods.getTokensByOwner(owner)
      .call();

    const _myLandOldtown = await _eventLandOldtown.map(async (item) => {
      // var url = await smLandFn(Config.LAND_OLD_TOWN_ADDR)
      //   .methods.tokenURI(item)
      //   .call();

      // let url =
      //   "https://gateway.pinata.cloud/ipfs/QmPRcz3guBQPgGeZzE1Q9cP3MbQQq2vdpttkvdk5pJSJog";

      // var n = url.lastIndexOf("/");
      // var result = url.substring(n + 1);

      let url =
        "https://ipfs.velaverse.io/ipfs/QmPRcz3guBQPgGeZzE1Q9cP3MbQQq2vdpttkvdk5pJSJog";
      // url = "https://ipfs.velaverse.io/ipfs/" + result;

      const location = await getLandWithTokenId(
        item,
        Config.LAND_OLD_TOWN_ADDR
      );
      var metadata = await getMetadata(url);

      if (metadata) {
        metadata.name = "LAND";
        metadata.image_cdn = "/image/map/landmark-phuket-oldtown.jpg";
        // "https://cdn.velaverse.io/getdata/phuket-oldtown.jpeg";
      }

      return {
        item,
        token_id: item,
        location: location,
        metadata: metadata,
        token_address: Config.LAND_OLD_TOWN_ADDR,
        owner_of: owner,
        type: "land",
      };
    });

    const _eventAsset = await cmAssets.methods.getTokensByOwner(owner).call();

    const _myBuilding = await _eventAsset.map(async (item) => {
      const url = await cmAssets.methods.tokenURI(item).call();

      const metadata = await getMetadata(url);
      return {
        item,
        token_id: item,
        location: null,
        metadata: metadata,
        token_address: Config.GENNFT_ADDR,
        owner_of: owner,
        type: "building",
      };
    });
    const myLand = await Promise.all(_myLand);
    const myLandSUT = await Promise.all(_myLandSUT);
    const myLandOldTown = await Promise.all(_myLandOldtown);
    const myBuilding = await Promise.all(_myBuilding);

    var _result = [].concat.apply(
      [],
      [myLand, myLandSUT, myLandOldTown, myBuilding]
    );

    const _data = await _result.filter((item) => {
      return item !== undefined;
    });

    var newArr = [];
    for (var i = 0; i < _data.length; i++) {
      newArr = newArr.concat(_data[i]);
    }
    const marketList = await marketplaceContract.methods.getItems().call();
    const auctionList = await auctionContract.methods.getAllAuction().call();
    const _r = newArr.map(async (item) => {
      // _item, _token, _owner
      const isPlacement = await checkPlacementAmount(
        marketList,
        auctionList,
        item.token_address,
        item.token_id,
        item.owner_of
      );

      var _land = "";
      if (item.token_address.toLowerCase() === Config.LAND_ADDR.toLowerCase()) {
        _land = "yaamo";
      } else if (
        item.token_address.toLowerCase() === Config.LAND_SUT_ADDR.toLowerCase()
      ) {
        _land = "sut";
      } else if (
        item.token_address.toLowerCase() ===
        Config.LAND_OLD_TOWN_ADDR.toLowerCase()
      ) {
        _land = "old town";
      } else if (
        item.token_address.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()
      ) {
        _land = "building";
      }
      return {
        ...item,
        _available: 1 - isPlacement.amount,
        status: isPlacement.status,
        list: isPlacement.list,
        offers: isPlacement.offers,
        data: isPlacement.data,
        asset_type: _land,
      };
    });

    const _rd = await Promise.all(_r);

    if (allList.length === 0) {
      // first load
      setAllList(_rd);
    }
    setFinalData(_rd);
    setLoading(false);
    // } catch (error) {
    // console.log(error);
    // }
  };

  useEffect(() => {
    fetchOwnerAsset();
  }, []);
  return (
    <>
      <div className="heading">
        <h2>My Assets</h2>
        <p>
          Here you can search and buy creator&apos;s ASSETS with Class to
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
                    On Sell
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
                      filterData.statusItem.list = e.target.checked
                        ? "hold"
                        : "none";
                      setFormatData();
                    }}
                  />
                  <label className="btn-checkbox" htmlFor="new">
                    Holding
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
                                    setPriceName("Price");
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
                    disabled={loading || filterData.price.status == false}
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    min="0"
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      } else {
                        filterData.price.min = e.target.value;
                      }
                      // setFormatData();
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <input
                    disabled={loading || filterData.price.status == false}
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    min="0"
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0;
                      } else {
                        filterData.price.max = e.target.value;
                      }
                      // setFormatData();
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <button
                    disabled={loading}
                    className="form-control"
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
          <div>
            {loading ? (
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
            ) : (
              <div>
                <div className="card-product-fullwidth">
                  {finalData.map((item, index) => {
                    return <CardBuyBid meta={item} />;
                  })}
                </div>
                {finalData.length == 0 && !loading && (
                  <div className="text-center mt-2">
                    <br></br>
                    <h2>
                      <i>No data</i>
                    </h2>
                  </div>
                )}
                {/* <button className={"btn-theme btn-primary"} align="center" onClick={() => {setAmountItem(amountItem += 20); fetchOwnerAsset()}}>READ MORE</button> */}
              </div>
            )}
          </div>
          {/* <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil(amountItem / itemPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => {handlePageClick(e)}}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'paginate-active'}
            
          /> */}
        </div>
      </section>
    </>
  );
};

export default MyAssetOwner;
