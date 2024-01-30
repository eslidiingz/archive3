import { useCallback, useEffect, useState } from "react";
import {
  fetchWhitelistUser,
  updateWhitelistUser,
} from "../../utils/api/whitelist-api";
import Config from "../../utils/config";
import { getWalletAddress } from "../../utils/wallet/connector";
import { Tab } from "@headlessui/react";
import { findUserById } from "../../utils/api/account-api";
import { updateAssetList } from "../../utils/api/asset-api";
import { getWalletAccount, mintContract, web3 } from "../../utils/web3/init";
import { ToastDisplay } from "../../components/ToastDisplay";
import { toast } from "react-toastify";
import ButtonState from "../../components/button/button-state";
import { useRouter } from "next/router";
import { fetchCollectionAll } from "../../utils/api/collection-api";
import ApproveUserList from "../../components/approve/approve-user";
import { Transition } from "@tailwindui/react";
import UploadBundleModal from "../../components/modal/upload-bundle";
import Pagination from "../../components/pagination/pagination";

const AdminApprove = () => {
  const router = useRouter();

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalRecord: 0,
    numLinks: []
  });

  const [filter, setFilter] = useState({creatorName: ''});
  const [whitelist, setWhitelist] = useState([]);
  const [asset, setAsset] = useState([]);
  const [filterAsset, setFilterAsset] = useState([]);
  const [statusLoading, setStatusLoading] = useState({});
  const [user, setUser] = useState([]);
  const [role, setRole] = useState("");
  const [collectionList, setCollectionList] = useState([]);
  const [uploadBundleState, setUploadBundleState] = useState(false);
  const [uploadBundleData, setUploadBundleData] = useState({});
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const menuTabs = [
    { name: "Approve Asset", roles: ["admin", "approver"] },
    {
      name: "Approve User",
      roles: ["admin"],
    },
    { name: "Revoke User", roles: ["admin"] },
    { name: "Update Bundle", roles: ["admin"] },
  ];

const handleChangePage = (selectedPage) => {
  if(pagination.page !== selectedPage){
    setPagination((prevState) => ({...prevState, page: selectedPage }));
  }
};

  const fetchUserApprove = async () => {
    const roles = "newbie";
    const _whitelist = await fetch(
      `${Config.COLLECTION_API}/whitelists?roles=${roles}`
    );
    const { rows } = await _whitelist.json();
    const _result = await rows.filter((item) => {
      const enteredCreatorName = filter.creatorName?.trim?.();

      const creatorName = `${item?.register?.firstName} ${item?.register?.lastName}`;

      let matchedCreatorName = null;

      if(typeof creatorName === 'string' && enteredCreatorName) {
        matchedCreatorName = creatorName.match(enteredCreatorName);
      }else if(!enteredCreatorName){
        matchedCreatorName = true;
      }
      
      return item.flag === "Y" && matchedCreatorName;
    });

    const _r = await Promise.all(_result);

    const chunks = [];
    for (let i = 0,len = _r.length ; i < len ; i += pagination.perPage){
      chunks.push(_r.slice(i,i+pagination.perPage));
    }

    const paginationLength = Math.ceil((chunks?.length || 0) / pagination.perPage);

    const numLinks = Array.from({ length: paginationLength }, (_, i) => ({no: i + 1}));

    setPagination((prevState) => ({...prevState, totalRecord: chunks.length, numLinks }));

    return chunks[pagination.page - 1] || [];
  };

  const handleAttribute = (asset_id) => {
    if (asset_id === "") {
      setFilterAsset(asset);
      return;
    }
    let filterData = asset.filter((x) => {
      return x && x._col._id === asset_id;
    });
    setFilterAsset(filterData);
  };
  const fetchAssetApproveList = async () => {
    const _asset = await fetch(
      `${Config.COLLECTION_API}/assets?address=${Config.GENNFT_ADDR}`
    );
    const { rows } = await _asset.json();

    const _result = await rows.filter((item) => item.verify !== "Y");

    const _r = [];

    await Promise.all(_result?.map?.(async (item) => {
      try {
        const _collection = await fetch(
          `${Config.COLLECTION_API}/collections/asset/${item._id}`
        );

        const collection = await _collection.json();

        const _attribute = await fetch(item.metadata);

        const attribute = await _attribute.json();

        const _col = collection[0];

        const enteredCreatorName = filter.creatorName?.trim?.();

        const creatorName = `${_col?.user?.whitelist?.register?.firstName} ${_col?.user?.whitelist?.register?.lastName}`;
  
        let matchedCreatorName = null;
  
        if(typeof creatorName === 'string' && enteredCreatorName) {
          matchedCreatorName = creatorName.match(enteredCreatorName);
        }else if(!enteredCreatorName){
          matchedCreatorName = true;
        }

        if(matchedCreatorName){
          const owner = collection[0].owner;
          const _user = await findUserById(owner);
          _r.push({ ...item, _col, _user, attribute });
        }
      } catch (err) {
        console.log(err);
      }
    }));

    const chunks = [];
    for (let i = 0,len = _r.length ; i < len ; i += pagination.perPage){
      chunks.push(_r.slice(i,i+pagination.perPage));
    }

    const paginationLength = Math.ceil((chunks?.length || 0) / pagination.perPage);

    const numLinks = Array.from({ length: paginationLength }, (_, i) => ({no: i + 1}));

    setPagination((prevState) => ({...prevState, totalRecord: chunks.length, numLinks }));

    return chunks[pagination.page - 1] || [];
  };

  const getLoginToken = async (_signature) => {
    try {
      const _f = await fetch(Config.CREATOR_LOGIN_URI, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature: _signature,
        }),
      });
      const _r = await _f.json();
      if (_r.status === false) return null;
      return _r.results.token;
    } catch {
      return null;
    }
  };

  const approveAssets = async (_id, item) => {
    const hashMsgMade = web3.utils.soliditySha3(Config.MSG_HASH, 1000);
    const account = await getWalletAccount();

    const _signature = await web3.eth.personal
      .sign(hashMsgMade, account, "")
      .catch((e) => {
        setStatusLoading({
          index: _id,
          loading: true,
        });
        toast(
          <ToastDisplay type="error" title="Failed" description={e.message} />
        );
        return;
      });

    if (typeof _signature !== "undefined") {
      const _token = await getLoginToken(_signature);

      const _data = {
        id: parseInt(item.verifyId),
        status: true,
      };
      const _r = await fetch(Config.UPDATE_VERIFY_BUILDING, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify(_data),
      });

      const result = await _r.json();

      if (result.status) {
        const _result = await updateAssetList(_id, {
          verify: "Y",
        });
        if (_result.status === 200) {
          await fetchApproveAsset();
        }
      }
    }
  };

  const cancelAssets = async (_id) => {
    const remark = prompt("Enter reason to reject building");
    if (remark != null) {
      const _result = await updateAssetList(_id, {
        verify: "R",
        remark,
      });

      if (_result.status === 200) {
        fetchApproveAsset();
      }
    }
  };

  const approveWhitelist = async (_id, _address, index) => {
    await mintContract.methods
      .grantRole(Config.MINTER_ROLE, _address)
      .send({ from: await getWalletAccount() })
      .on("sending", function (result) {
        setStatusLoading({
          index: index,
          loading: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("transactionHash", (transaction) => {
        setStatusLoading({
          index: index,
          loading: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Your Transaction"}
            description={"View you transaction"}
            href={`${Config.BLOCK_EXPLORER}/tx/${transaction}`}
          />
        );
      })
      .on("receipt", async () => {
        setStatusLoading({
          index: false,
          loading: true,
        });

        const _result = await updateWhitelistUser(_id, {
          roles: "minter",
        });

        <ToastDisplay
          type={"success"}
          title={"Approve Success"}
          description={"Approve Success"}
        />;

        if (_result.status === 200) {
          fetchApproveWhitelist();
        }
      })
      .on("error", function (error) {
        setStatusLoading({
          index: index,
          loading: false,
        });
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction rejected"}
            description={error.message}
          />
        );
      });
  };

  const cancelWhitelist = async (_id) => {
    const _result = await updateWhitelistUser(_id, {
      flag: "N",
    });

    if (_result.status === 200) {
      fetchApproveWhitelist();
    }
  };

  const fetchApproveWhitelist = useCallback(() => {
    const fetchingData = async () => {
      const current = await fetchUserApprove();
      setWhitelist(current);
    };

    fetchingData();
  }, [pagination.page, filter.creatorName]);

  const fetchApproveAsset = useCallback(() => {
    const fetchingData = async () => {
      const current = await fetchAssetApproveList();
      setAsset(current);
      setFilterAsset(current);
    };

    fetchingData();
  }, [pagination.page, filter.creatorName]);

  const fetchUserApproveList = async () => {
    const roles = "minter";
    const _whitelist = await fetch(
      `${Config.COLLECTION_API}/whitelists?roles=${roles}&page=${pagination.page}&size=${pagination.perPage}`
    );
    const { rows } = await _whitelist.json();
    const _result = await rows.filter((item) => {

      const enteredCreatorName = filter.creatorName?.trim?.();

      const creatorName = `${item?.register?.firstName} ${item?.register?.lastName}`;

      let matchedCreatorName = null;

      if(typeof creatorName === 'string' && enteredCreatorName) {
        matchedCreatorName = creatorName.match(enteredCreatorName);
      }else if(!enteredCreatorName){
        matchedCreatorName = true;
      }

      return item.flag === "Y" && matchedCreatorName;
    
    });

    const _r = await Promise.all(_result);

    const chunks = [];
    for (let i = 0,len = _r.length ; i < len ; i += pagination.perPage){
      chunks.push(_r.slice(i, i+pagination.perPage));
    }

    const paginationLength = Math.ceil((chunks?.length || 0) / pagination.perPage);

    const numLinks = Array.from({ length: paginationLength }, (_, i) => ({no: i + 1}));

    setPagination((prevState) => ({...prevState, totalRecord: chunks.length, numLinks }));
    
    return chunks[pagination.page - 1] || [];
  };

  const fetchApproveUser = useCallback(() => {
    const fetchingData = async () => {
      const current = await fetchUserApproveList();
      setUser(current);
    };

    fetchingData();
  }, [pagination.page, filter.creatorName]);

  const fetchCollectionList = async () => {
    const { rows } = await fetchCollectionAll();
    setCollectionList(rows);
  };

  const revokeWhitelist = async (_id, _address, index) => {
    await mintContract.methods
      .revokeRole(Config.MINTER_ROLE, _address)
      .send({ from: await getWalletAccount() })
      .on("sending", function (result) {
        setStatusLoading({
          index: index,
          loading: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("transactionHash", (transaction) => {
        setStatusLoading({
          index: index,
          loading: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Your Transaction"}
            description={"View you transaction"}
            href={`${Config.BLOCK_EXPLORER}/tx/${transaction}`}
          />
        );
      })
      .on("receipt", async () => {
        setStatusLoading({
          index: false,
          loading: true,
        });

        const _result = await updateWhitelistUser(_id, {
          flag: "N",
        });

        <ToastDisplay
          type={"success"}
          title={"Revoke Success"}
          description={"Revoke Success"}
        />;

        if (_result.status === 200) {
          fetchApproveUser();
        }
      })
      .on("error", function (error) {
        setStatusLoading({
          index: index,
          loading: false,
        });
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction rejected"}
            description={error.message}
          />
        );
      });
  };
  const checkAdminRole = async () => {
    const account = await getWalletAccount();
    const { rows } = await fetchWhitelistUser(account);
    if (rows.length > 0) {
      rows[0].roles = 'admin';
      setRole(rows[0].roles);

      if (rows && rows.length > 0) {
        if (rows[0].roles !== "admin" && rows[0].roles !== "approver") {
          router.push("/market");
        }
      }
    } else {
      router.push("/market");
    }
  };

  const copyURL = (url) => {
    navigator.clipboard.writeText(Config.BUNDLE_URI + url);
    toast(
      <ToastDisplay
        type={"success"}
        title={"Message"}
        description={"Copy URL Success"}
      />
    );
  };

  const handleChangeTab = (tabIndex) => {
    setFilter({creatorName: ''});
    setSelectedTabIndex(tabIndex);
    
  };

  const handleChangeCreatorName = (e) => {
    setFilter({creatorName: e.target.value})
  };

  useEffect(() => {
    if (router.isReady) checkAdminRole();
  }, [router]);

  useEffect(() => {
    if (selectedTabIndex === 0) {
      fetchApproveAsset();
    } else if (selectedTabIndex === 1) {
      fetchApproveWhitelist();
    } else if (selectedTabIndex === 2) {
      fetchApproveUser();
    } else if (selectedTabIndex === 3) {
      fetchApproveAsset();
      fetchCollectionList();
    }
  }, [selectedTabIndex, pagination.page, filter.creatorName]);

  if (!asset) {
    return null;
  }

  return (
    <>
      <div className="heading-approve">
        <h2>{role === "admin" ? "Admin Approve" : "Asset Approve"}</h2>
      </div>
      <main className="content content-approve">
        <div className="flex flex-col mx-12">
          <Tab.Group selectedIndex={selectedTabIndex} onChange={(index) => handleChangeTab(index)}>
            <Tab.List className="flex approve-tabnav border-0">
              {role === "approver" &&
                menuTabs.map(
                  (element, index) =>
                    element.roles.includes("approver") === true && (
                      <Tab
                        key={index}
                        className={({ selected }) => (
                          "tab-approve",
                          selected ? "tab-approve selected" : "tab-approve"
                        )}
                      >
                        {element.name}
                      </Tab>
                    )
                )}

              {role === "admin" &&
                menuTabs.map((element, index) => (
                  <Tab
                    key={index}
                    className={({ selected }) => (
                      "tab-approve",
                      selected ? "tab-approve selected" : "tab-approve"
                    )}
                  >
                    {element.name}
                  </Tab>
                ))}
                <div className="w-60">
                 <input type="text" className="form-control input-filter" value={filter.creatorName} placeholder="Creator Name..." onChange={handleChangeCreatorName} />
                </div>
            </Tab.List>
            <Tab.Panels className={"mt-2"}>
              {role === "admin" && (
                <Tab.Panel>
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Users
                              </th>

                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Abouts
                              </th>

                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Portfolios
                              </th>

                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {whitelist.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="ml-0">
                                        <div className="text-sm font-medium text-gray-900">
                                          {`${item.register.firstName} ${item.register.lastName}`}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {getWalletAddress(item.address)}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 td-about">
                                    <span className="text-black">
                                      {item.register.about}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <ul>
                                      {item.register.portfolio.length > 0 &&
                                        item.register.portfolio.map(
                                          (item, sub) => {
                                            return (
                                              <li
                                                key={sub}
                                                className="text-black"
                                              >
                                                <a
                                                  href={item.value}
                                                  target={`_blank`}
                                                  className="cursor-pointer underline td-port-link"
                                                  rel="noreferrer"
                                                >
                                                  {item.value}
                                                </a>
                                              </li>
                                            );
                                          }
                                        )}
                                    </ul>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ButtonState
                                      onFunction={() =>
                                        approveWhitelist(
                                          item._id,
                                          item.address,
                                          index
                                        )
                                      }
                                      icon={"fa fa-check mr-2"}
                                      text={"Approve"}
                                      loading={
                                        statusLoading.index === index &&
                                        statusLoading.loading === true
                                      }
                                      classStyle={
                                        "btn-theme btn-primary btn-sm mr-1"
                                      }
                                    />

                                    <button
                                      onClick={() => cancelWhitelist(item._id)}
                                      className="btn-theme btn-danger btn-sm ml-1"
                                    >
                                      <i className="fa fa-trash mr-2"></i>
                                      Cancel
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              )}

              <Tab.Panel>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Assets
                            </th>

                            {/* <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Owner
                            </th> */}
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Detail
                            </th>

                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {asset.map((item, index) => {
                            if (item !== undefined) {
                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-12 w-12">
                                        <img
                                          className="h-12 w-12"
                                          src={
                                            item &&
                                            typeof item.image !== "undefined" &&
                                            item.image
                                          }
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          Collection :{" "}
                                          {item &&
                                            typeof item._col.title !==
                                              "undefined" &&
                                            item._col.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          Asset name :{" "}
                                          {item &&
                                            typeof item.attribute !==
                                              "undefined" &&
                                            item.attribute.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          ID :{" "}
                                          {item &&
                                            typeof item.token !== "undefined" &&
                                            item.token}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          Owner Address :{" "}
                                          {item &&
                                            typeof item._user.address !==
                                              "undefined" &&
                                            getWalletAddress(
                                              item._user.address
                                            )}
                                          <i
                                            className="fa fa-solid fa-copy ml-1"
                                            onClick={() => {
                                              let addr = item._user.address;
                                              navigator.clipboard.writeText(
                                                addr
                                              );
                                              toast(
                                                <ToastDisplay
                                                  type={"success"}
                                                  title={"Address"}
                                                  description={
                                                    "Copy Owner Address Success"
                                                  }
                                                />
                                              );
                                            }}
                                          ></i>
                                        </div>
                                        {/*  asset name  */}
                                      </div>
                                    </div>
                                  </td>

                                  {/* <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="">
                                        <div className="text-sm font-medium text-gray-900">
                                          Title :{" "}
                                          {item &&
                                            typeof item._user.title !==
                                              "undefined" &&
                                            item._user.title}
                                        </div>
                                      </div>
                                    </div>
                                  </td> */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {item &&
                                      typeof item.attribute.attributes !==
                                        "undefined" && [
                                        <>
                                          <div className="text-sm text-gray-500">
                                            Building size :{" "}
                                            {item.attribute.attributes.size_x +
                                              " x " +
                                              item.attribute.attributes.size_y}
                                          </div>
                                          {/* <div className="text-sm text-gray-500">
                                              Floor Width :{" "}
                                              {typeof item.attribute
                                                .attributes.size_x !==
                                              "undefined"
                                                ? item.attribute.attributes
                                                    .size_x
                                                : 0}{" "}
                                              (Blocks)
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              Floor Length :{" "}
                                              {typeof item.attribute
                                                .attributes.size_y !==
                                              "undefined"
                                                ? item.attribute.attributes
                                                    .size_y
                                                : 0}{" "}
                                              (Blocks)
                                            </div> */}
                                          {item.verify === "R" && (
                                            <div className="text-sm text-red-500">
                                              Reason reject :{" "}
                                              {item.remark === "" ? (
                                                <i>None</i>
                                              ) : (
                                                item.remark
                                              )}
                                            </div>
                                          )}
                                        </>,
                                      ]}
                                    <div>{/* Bundle name */}</div>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      className="btn-theme btn-primary btn-sm mr-1"
                                      onClick={() => {
                                        copyURL(
                                          item.attribute.attributes.asset_model
                                        );
                                      }}
                                    >
                                      Copy URL
                                    </button>
                                    {item.verify !== "R" && (
                                      <button
                                        onClick={() =>
                                          approveAssets(item._id, item)
                                        }
                                        className="btn-theme btn-primary btn-sm mr-1"
                                      >
                                        Approve
                                      </button>
                                    )}
                                    {item.verify !== "R" && (
                                      <button
                                        onClick={() => cancelAssets(item._id)}
                                        className="btn-theme btn-gray btn-sm ml-1"
                                      >
                                        Reject
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              {role === "admin" && (
                <Tab.Panel>
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Users
                              </th>

                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {user.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="ml-0">
                                        <div className="text-sm font-medium text-gray-900">
                                          {`${item.register.firstName} ${item.register.lastName}`}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {getWalletAddress(item.address)}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ButtonState
                                      onFunction={() =>
                                        revokeWhitelist(
                                          item._id,
                                          item.address,
                                          index
                                        )
                                      }
                                      text={"Revoke"}
                                      loading={
                                        statusLoading.index === index &&
                                        statusLoading.loading === true
                                      }
                                      classStyle={
                                        "btn-theme btn-primary btn-sm mr-1"
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
                </Tab.Panel>
              )}
              {role === "admin" && (
                <Tab.Panel>
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      {/* <label className="block text-sm font-medium text-white">
                        Collection
                      </label> */}
                      <select
                        onChange={(e) => handleAttribute(e.target.value)}
                        className="form-control mb-2 bg-slate-200"
                        style={{color: "darkgray"}}
                      >
                        <option value={""} className="bg-slate">Select Collection</option>

                        {collectionList.map((item, index) => {
                          return (
                            <option key={index} value={item._id} className="bg-slate-200">
                              {item.title}
                            </option>
                          );
                        })}
                      </select>

                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Assets
                              </th>

                              {/* <th
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Owner
                              </th> */}
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Detail
                              </th>

                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterAsset.map((item, index) => {
                              if (item !== undefined) {
                                return (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                          <img
                                            className="h-12 w-12"
                                            src={
                                              item &&
                                              typeof item.image !==
                                                "undefined" &&
                                              item.image
                                            }
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">
                                            Collection :{" "}
                                            {item &&
                                              typeof item._col.title !==
                                                "undefined" &&
                                              item._col.title}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Asset name :{" "}
                                            {item &&
                                              typeof item.attribute !==
                                                "undefined" &&
                                              item.attribute.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            ID :{" "}
                                            {item &&
                                              typeof item.token !==
                                                "undefined" &&
                                              item.token}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Owner Address :{" "}
                                            {item &&
                                              typeof item._user.address !==
                                                "undefined" &&
                                              getWalletAddress(
                                                item._user.address
                                              )}
                                            <i
                                              className="fa fa-solid fa-copy ml-1"
                                              onClick={() => {
                                                let addr = item._user.address;
                                                navigator.clipboard.writeText(
                                                  addr
                                                );
                                                toast(
                                                  <ToastDisplay
                                                    type={"success"}
                                                    title={"Address"}
                                                    description={
                                                      "Copy Owner Address Success"
                                                    }
                                                  />
                                                );
                                              }}
                                            ></i>
                                          </div>
                                          {/*  asset name  */}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {item &&
                                        typeof item.attribute.attributes !==
                                          "undefined" && [
                                          <>
                                            <div className="text-sm text-gray-500">
                                              Building size :{" "}
                                              {item.attribute.attributes
                                                .size_x +
                                                " x " +
                                                item.attribute.attributes
                                                  .size_y}
                                            </div>
                                            {/* <div className="text-sm text-gray-500">
                                                Floor Width :{" "}
                                                {typeof item.attribute
                                                  .attributes.size_x !==
                                                "undefined"
                                                  ? item.attribute.attributes
                                                      .size_x
                                                  : 0}{" "}
                                                (Blocks)
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                Floor Length :{" "}
                                                {typeof item.attribute
                                                  .attributes.size_y !==
                                                "undefined"
                                                  ? item.attribute.attributes
                                                      .size_y
                                                  : 0}{" "}
                                                (Blocks)
                                              </div> */}
                                            {item.verify === "R" && (
                                              <div className="text-sm text-red-500">
                                                Reason reject :{" "}
                                                {item.remark === "" ? (
                                                  <i>None</i>
                                                ) : (
                                                  item.remark
                                                )}
                                              </div>
                                            )}
                                          </>,
                                        ]}
                                      <div>{/* Bundle name */}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        className="btn-theme btn-primary btn-sm mr-1"
                                        onClick={() => {
                                          copyURL(
                                            item.attribute.attributes.asset_model
                                          );
                                        }}
                                      >
                                        Copy url old Bundle
                                      </button>
                                      <button
                                        onClick={() => {
                                          // approveAssets(item._id, item)
                                          setUploadBundleState(true);
                                          setUploadBundleData(item);
                                        }}
                                        className="btn-theme btn-primary btn-sm mr-1"
                                      >
                                        Upload new bundle
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              )}
            </Tab.Panels>
          </Tab.Group>
          <Pagination numLinks={pagination.numLinks} onChangePage={handleChangePage} currentPage={pagination.page} />
        </div>
        <Transition
          className="absolute"
          style={{ zIndex: "100" }}
          show={uploadBundleState}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <UploadBundleModal
            show={uploadBundleState}
            onClose={() => setUploadBundleState(false)}
            data={uploadBundleData}
          />
        </Transition>
      </main>
    </>
  );
};

export default AdminApprove;
