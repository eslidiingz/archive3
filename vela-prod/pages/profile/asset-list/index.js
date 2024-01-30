import { Transition } from "@tailwindui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UploadBundleModal from "../../../components/modal/upload-bundle";
import { ToastDisplay } from "../../../components/ToastDisplay";
import Config from "../../../utils/config";
import { getWalletAddress } from "../../../utils/wallet/connector";
import { getMetadata, getWalletAccount } from "../../../utils/web3/init";
import { cmAssets } from "../../../utils/web3/nft";

const AssetList = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [owner, setOwner] = useState("");
  const [uploadBundleState, setUploadBundleState] = useState(false);
  const [uploadBundleData, setUploadBundleData] = useState({});
  useEffect(() => {
    initialize();
  }, []);
  const initialize = async () => {
    setPageLoading(true);
    const owner = await getWalletAccount();
    setOwner(owner);
    const _eventAsset = await cmAssets.methods.getTokensByOwner(owner).call();

    const _myBuilding = await _eventAsset.map(async (tokenId) => {
      const url = await cmAssets.methods.tokenURI(tokenId).call();
      const metadata = await getMetadata(url);
      let url_verify = await fetch(
        `https://collection.velaverse.io/api/v1/assets/${Config.GENNFT_ADDR}/${tokenId}`
      );
      let raw_data = await url_verify.json();
      let data = raw_data.length > 0 ? raw_data[0] : {};
      const _collection = await fetch(
        `${Config.COLLECTION_API}/collections/asset/${data._id}`
      );
      const collection = await _collection.json();
      const _attribute = await fetch(data.metadata);

      const attribute = await _attribute.json();
      data["attribute"] = attribute;
      console.log();
      return {
        tokenId,
        token_id: tokenId,
        location: null,
        metadata: metadata,
        token_address: Config.GENNFT_ADDR,
        owner_of: owner,
        type: "building",
        data: data,
        _col: collection[0],
        attr: attribute,
        // attribute: attribute
      };
    });
    const myBuilding = await Promise.all(_myBuilding);
    console.log(myBuilding);
    setAssets(myBuilding);
    setPageLoading(false);
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
  return (
    <>
      <main className="content content-approve">
        <div className="flex flex-col mx-12">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg approve-table-scorll">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Assets
                      </th>
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
                    {assets.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12"
                                  src={item.data.image}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  Collection : {item._col.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Asset name : {item.attr.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID : {item.data.token}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Owner Address : {getWalletAddress(owner)}
                                  {
                                    <i
                                      className="fa fa-solid fa-copy ml-1"
                                      onClick={() => {
                                        let addr = owner;
                                        navigator.clipboard.writeText(addr);
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
                                  }
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              Building size :{" "}
                              {item.attr.attributes.size_x +
                                " x " +
                                item.attr.attributes.size_y}
                            </div>
                            {console.log(item.data.remark)}
                            {item.data.verify === "R" && (
                              <div className="text-sm text-red-500">
                                Reason reject :{" "}
                                {item.data.remark === "" ? (
                                  <i>None</i>
                                ) : (
                                  item.data.remark
                                )}
                              </div>
                            )}
                            {item.data.verify === "Y" && (
                              <div className="text-sm text-green-500">
                                Already Verified
                              </div>
                            )}
                            {item.data.verify === "" && (
                              <div className="text-sm text-yellow-500">
                                Pending ...
                              </div>
                            )}
                            <div>{/* Bundle name */}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="btn-theme btn-primary btn-sm mr-1"
                              onClick={() => {
                                copyURL(item.attr.attributes.asset_model);
                              }}
                            >
                              Copy URL
                            </button>
                            {item.data.verify === "R" && (
                              <button
                                onClick={() => {
                                  // approveAssets(item._id, item)
                                  setUploadBundleState(true);
                                  setUploadBundleData(item.data);
                                }}
                                className="btn-theme btn-primary btn-sm mr-1"
                              >
                                Upload Bundle
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {assets.length == 0 && pageLoading == false && (
                      <tr>
                        <td colSpan={3}>
                          <i>None</i>
                        </td>
                      </tr>
                    )}
                    {pageLoading && (
                      <tr>
                        <td colSpan={3} align="center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

export default AssetList;
