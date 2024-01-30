import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Config from "../../../utils/config";
import ButtonState from "../../../components/button/button-state";
import { getWalletAccount, mintContract, web3 } from "../../../utils/web3/init";
import { ToastDisplay } from "../../../components/ToastDisplay";
import {
  fetchCollectionList,
  putAssetCollection,
  putHolderCollection,
} from "../../../utils/api/collection-api";
import { createAssetList } from "../../../utils/api/asset-api";
import { useRouter } from "next/router";
import { fetchUserData } from "../../../utils/api/account-api";

const CreateAssetPage = () => {
  const router = useRouter();
  const bundleFile = useRef();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [currentFile, setCurrentFile] = useState(null);

  const [defaultCollection, setDefaultCollection] = useState("");
  const [collection, setCollection] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectCollection, setSelectCollection] = useState(null);

  const [assetUpload, setAssetUpload] = useState(false);
  const [assetFile, setAssetFile] = useState(null);
  const [attributeLength, setAttributeLength] = useState(1);
  const [attributeWidth, setAttributeWidth] = useState(1);
  const [size, setSize] = useState([]);
  const [maxSize, setMaxSize] = useState(0);
  const [haveBackground, setHaveBackground] = useState(false);
  const [assetVisible, setAssetVisible] = useState(true);
  const [enteredTag, setEnteredTag] = useState("");
  const [tags, setTags] = useState([]);

  const handleCollection = (val) => {
    setSelectCollection(val);
    setDefaultCollection(val);
  };

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  const selectAssetModel = (event) => {
    const file = event.target.files[0];
    if (file.size <= maxSize) {
      setAssetFile(file);
    } else {
      toast(
        <ToastDisplay
          type={"warning"}
          title={"File size limit"}
          description={`File size not more than ${maxSize / 1048576} mb`}
        />
      );
      bundleFile.current.value = "";
      return;
    }
  };

  const handleAttribute = (event) => {
    const sizeFile = size.filter((item) => item.id == event)[0].size * 1048576;
    setMaxSize(sizeFile);
    setAttributeLength(event);
    setAttributeWidth(event);
  };

  const createModel = async () => {
    const fd = new FormData();

    fd.append("zipfile", assetFile);

    const _result = await fetch(Config.BUNDLE_ASSET_URI, {
      method: "post",
      body: fd,
    });

    return await _result.json();
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

  const createAsset = async () => {
    var attributes = {};
    if (assetFile) {
      const _model = await createModel();
      attributes = {
        size_x: attributeWidth,
        size_y: attributeLength,
        asset_model: _model.dir_uuid,
      };
    }

    let title = "name & description & image & collection can't be null";

    if (
      name == "" ||
      description == "" ||
      currentFile == null ||
      collection.length == 0
    ) {
      title = "name & description & image & collection can't be null";

      toast(
        <ToastDisplay
          type={"warning"}
          title={title}
          description={"Please fill the form"}
        />
      );
      return;
    }

    const metadata = {
      name,
      description,
      external_url: externalLink,
      attributes,
    };

    const fd = new FormData();
    fd.append("file", currentFile);
    fd.append("metadata", JSON.stringify(metadata));

    try {
      setLoading(true);

      const hashMsgMade = web3.utils.soliditySha3(Config.MSG_HASH, 1000);
      const account = await getWalletAccount();

      const _signature = await web3.eth.personal
        .sign(hashMsgMade, account, "")
        .catch((e) => {
          setLoading(false);
          toast(
            <ToastDisplay type="error" title="Failed" description={e.message} />
          );
          return;
        });
      if (typeof _signature !== "undefined") {
        const _token = await getLoginToken(_signature);
        const _result = await fetch(Config.MINT_ASSET_URI, {
          method: "post",
          body: fd,
        });

        const _data = await _result.json();

        const _mint = await mintContract.methods
          .mint(await getWalletAccount(), _data.metadata_hash_cdn)
          .send({ from: await getWalletAccount() })
          .on("sending", () => {
            setLoading(true);
            toast(
              <ToastDisplay
                type={"process"}
                title={"Waiting For Confirmation"}
                description={"Confirm this transaction in your wallet"}
              />
            );
          })
          .on("receipt", () => {
            setLoading(false);
            toast(
              <ToastDisplay
                type={"success"}
                title={"Transaction reciept"}
                description={"Mint Assets success !!!"}
              />
            );
          })
          .on("error", (error) => {
            console.log(error);
            setLoading(false);
            toast(
              <ToastDisplay
                type={"error"}
                title={"Transaction failed"}
                description={"Transaction failed please try again"}
              />
            );
            // clearForm();
          });

        const _d = {
          title: name,
          contract_address: _mint.events.Transfer.address,
          token_id: web3.utils.toNumber(
            _mint.events.Transfer.returnValues.tokenId
          ),
          size_x: parseInt(attributes.size_x),
          size_y: parseInt(attributes.size_y),
          interface: "ERC721",
          image_cdn: _data.image_cdn,
          bundle_cdn: `${Config.BUNDLE_URI}/${attributes.asset_model}`,
          request_type: "BUILDING",
          has_underground: haveBackground ? true : false,
        };

        const _r = await fetch(Config.ADD_VERIFY_BUILDING, {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify(_d),
        });
        const result = await _r.json();

        const data = {
          address: _mint.events.Transfer.address,
          token: _mint.events.Transfer.returnValues.tokenId,
          hash: _data.Hash,
          metadata: _data.metadata_hash_cdn,
          image: _data.image_cdn,
          verify: "",
          verifyId: result.results.id,
          visible: true,
          tags: tags,
        };

        const _resultAsset = await createAssetList(data);
        const _assetsArray = await _resultAsset.json();
        if (result.status === true) {
          if (selectCollection !== null) {
            const _assets = await putAssetCollection(selectCollection, {
              asset: _assetsArray._id,
            });
            await putHolderCollection(selectCollection, {
              holder: await getWalletAccount(),
            });
            if (_assets.status === 200) {
              router.push("/profile/mynft/");
            }
          } else {
            if (_resultAsset.status === 200 || _resultAsset?._id) {
              router.push("/profile/mynft/");
            }
          }
        }
      }
    } catch (error) {
      setLoading(false);
      toast(error);
      // clearForm();
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setExternalLink("");
    setCurrentFile(null);
    setPreviewImage(null);
  };

  const fetchCollection = async () => {
    const _user = await fetchUserData(await getWalletAccount());
    const { rows } = await fetchCollectionList(_user.rows[0]._id);
    setCollection(rows);
  };

  useEffect(() => {
    if (!router.isReady) return;

    setDefaultCollection(router.query.collection || "");
    setSelectCollection(router.query.collection || "");

    fetchCollection();
    const size = [
      {
        id: 1,
        text: "1x1",
        size: 1,
      },
      {
        id: 2,
        text: "2x2",
        size: 2,
      },
      {
        id: 3,
        text: "3x3",
        size: 2,
      },
      {
        id: 4,
        text: "4x4",
        size: 2,
      },
      {
        id: 5,
        text: "5x5",
        size: 3,
      },
      {
        id: 6,
        text: "6x6",
        size: 3,
      },
      {
        id: 7,
        text: "7x7",
        size: 3,
      },
      {
        id: 8,
        text: "8x8",
        size: 3,
      },
      {
        id: 9,
        text: "9x9",
        size: 3,
      },
      {
        id: 10,
        text: "10x10",
        size: 3,
      },
      {
        id: 11,
        text: "11x11",
        size: 4,
      },
      {
        id: 12,
        text: "12x12",
        size: 4,
      },
      {
        id: 13,
        text: "13x13",
        size: 4,
      },
      {
        id: 14,
        text: "14x14",
        size: 4,
      },
      {
        id: 15,
        text: "15x15",
        size: 4,
      },
      {
        id: 16,
        text: "16x16",
        size: 4,
      },
    ];
    setSize(size);
  }, [router.isReady]);

  const handleChangeTag = (e) => {
    setEnteredTag(e.target.value);
  };

  const handlePressToSelectTag = (e) => {
    if (event.key === "Enter") {
      setTags((prevState) => [...prevState, e.target.value.trim()]);
      setEnteredTag("");
    }
  };

  const handleRemoveEnteredTag = (selectedIndex) => {
    setTags((prevState) => [
      ...prevState.filter((tag, index) => index !== selectedIndex),
    ]);
  };

  return (
    <>
      <div className="heading">
        <h2>Create Assets</h2>
        <p>
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>
      <section className="vela-fluid">
        <div className="content">
          <div className="space-y-8 divide-y divide-gray-800">
            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                  Asset Name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    className="form-control max-w-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                  External Link
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    className="form-control max-w-lg"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2"
                >
                  Images
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-800 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="upload"
                          className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <img id="cover-image" src={previewImage} />
                          <div
                            id="upload-image"
                            className="btn-theme btn-primary-long allcen btn-padding"
                          >
                            <span>Upload a file</span>
                          </div>
                        </label>
                        <input
                          className="hidden"
                          id="upload"
                          name="upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => selectFile(e)}
                        />

                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    rows="3"
                    className="max-w-lg form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <p className="form-control max-w-lg">
                    Write a few sentences about this Collection.
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                  Select Collection
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="col-span-1 mb-4">
                    <select
                      onChange={(e) => handleCollection(e.target.value)}
                      className="form-control"
                      value={defaultCollection}
                    >
                      <option value={""}>Select Collection</option>
                      {collection.map((item, key) => {
                        const urlParams = new URLSearchParams(
                          window.location.search
                        );
                        const myParam = urlParams.get("id");
                        if (myParam == item._id)
                          return (
                            <option key={key} value={item._id} selected>
                              {item.title}
                            </option>
                          );
                        return <option value={item._id}>{item.title}</option>;
                      })}
                    </select>
                  </div>

                  <div className="col-span-1 mb-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          onChange={() => setAssetUpload(!assetUpload)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="candidates" className="label-modal">
                          Upload Asset 3D Model
                        </label>
                      </div>
                    </div>

                    {assetUpload && (
                      <div>
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Size
                          </label>
                          <select
                            onChange={(e) => handleAttribute(e.target.value)}
                            className="form-control"
                          >
                            <option value={""}>Select Size</option>
                            {size.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.text}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Asset Model
                          </label>
                          <input
                            type="file"
                            ref={bundleFile}
                            name="asset-model"
                            accept="application/zip"
                            onChange={(e) => selectAssetModel(e)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="mt-4">
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                onChange={() =>
                                  setHaveBackground(!haveBackground)
                                }
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="candidates"
                                className="label-modal"
                              >
                                Have floor (default = No floor)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                  Visible
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="col-span-1 mb-4">
                    <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={assetVisible} onChange={() => setAssetVisible(!assetVisible)} />
                  </div>
                </div>
              </div> */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-800 sm:pt-5">
                <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                  Tags
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="col-span-1 mb-4">
                    <input
                      type="text"
                      className="form-control max-w-lg"
                      value={enteredTag}
                      onChange={handleChangeTag}
                      onKeyPress={handlePressToSelectTag}
                    />
                  </div>
                  <div className="col-span-1 mb-4 tag-badge-container">
                    {tags.map((tag, index) => (
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
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => (window.location = "/profile/mynft")}
                >
                  Cancel
                </button>
                <ButtonState
                  text={"Save"}
                  loading={loading}
                  classStyle={"btn btn-primary"}
                  onFunction={() => createAsset()}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateAssetPage;
