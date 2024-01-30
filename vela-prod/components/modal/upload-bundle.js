import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getStrTokenSymbol } from "../../utils/web3/init";
import { ToastDisplay } from "../ToastDisplay";

const UploadBundleModal = (props) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [file, setFile] = useState({});
  const [dirkey, setDirkey] = useState("");
  useEffect(() => {
    initialize();
  }, []);
  const onClose = (event) => {
    props.onClose && props.onClose(event);
  };
  const initialize = () => {
    let assetModel = props.data.attribute.attributes.asset_model;
    let dirArr = assetModel.split("/");
    let dir = dirArr[dirArr.length - 1];
    setDirkey(dir);
  };
  const uploadFile = async () => {
    const fd = new FormData();
    fd.append("zipfile", file);
    fd.append("dir_key", dirkey);
    try {
      setPageLoading(true);
      let url = "https://cdn.velaverse.io/zip_update";
      const result = await fetch(url, {
        method: "post",
        body: fd,
      });
      toast(
        <ToastDisplay
          type={"success"}
          title={"Upload Bundle"}
          description={"Upload Successfully"}
        />
      );
      onClose();
    } catch (e) {
      console.log(e);
      toast(
        <ToastDisplay
          type={"error"}
          title={"Upload Bundle Failed"}
          description={"Upload Failed"}
        />
      );
    }
  };
  return (
    <>
      {console.log(props.data)}
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="area-modal">
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
            &#8203;
          </span>

          <div className="modal-global-size transform transition-all">
            <div className="hidden close-modal">
              <button
                type="button"
                onClick={() => onClose()}
                className="close-modal-text"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="bg-modal">
              <div className="bg-modal-warpper max-w-3xl mx-auto p-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:p-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 lg:col-span-1">
                    <div>
                      <img
                        src={
                          props.data.image
                            ? props.data.image
                            : "/assets/image/no-image.jpg"
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "/assets/image/no-image.jpg";
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-span-3 lg:col-span-2">
                    <div>
                      <h2 className="modal-title">Upload bundle</h2>
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="grid grid-cols-6 gap-x-6 gap-y-3">
                          <div className="col-span-6">
                            <label className="label-modal">Address</label>
                            <input
                              readOnly
                              disabled
                              type="text"
                              value={props.data.address}
                              className="form-control"
                            />
                          </div>

                          <div className="col-span-6">
                            <label className="label-modal">Token ID</label>
                            <input
                              readOnly
                              disabled
                              type="text"
                              value={props.data.token}
                              className="form-control"
                            />
                          </div>
                          <div className="col-span-6">
                            <label className="label-modal">Asset Name</label>
                            <input
                              readOnly
                              disabled
                              type="text"
                              value={props.data.attribute.name}
                              className="form-control"
                            />
                          </div>
                          <div className="col-span-6">
                            <label className="label-modal">Bundle file</label>
                            <input
                              type="file"
                              name="zipfile"
                              accept="*.zip"
                              className="form-control"
                              onChange={(e) => setFile(e.target.files[0])}
                            />
                          </div>

                          <div className="col-span-6 mt-2 flex items-center ">
                            <button
                              onClick={() => onClose()}
                              type="button"
                              className="btn-theme btn-secondary"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn-theme btn-primary ml-4"
                              onClick={() => {
                                uploadFile();
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadBundleModal;
