import { useRouter } from "next/router";
import { useState } from "react";
import { fetchUserData } from "../../../utils/api/account-api";
import Config from "../../../utils/config";
import { getWalletAccount } from "../../../utils/web3/init";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../../components/ToastDisplay";
const CreateCollectionPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentFile, setCurrentFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  const createCollection = async () => {
    const { rows } = await fetchUserData(await getWalletAccount());
    const account = rows[0]._id;

    const collectionUrl = "collections";
    const collectionEndpoint = `${Config.COLLECTION_API}/${collectionUrl}`;
    if (name == "" || description == "" || currentFile == null) {
      toast(
        <ToastDisplay
          type={"warning"}
          title={"name & description & image can't be null"}
          description={"Please fill the form"}
        />
      );
      return;
    }
    const fd = new FormData();
    fd.append("title", name);
    fd.append("description", description);
    fd.append("cover", currentFile);
    fd.append("owner", account);

    const result = await fetch(collectionEndpoint, {
      method: "post",
      body: fd,
    });

    const data = await result.json();
    const userUrl = "users";
    const userEndpoint = `${Config.COLLECTION_API}/${userUrl}/${account}`;

    const fetchCollectionAssets = await fetch(
      `${Config.COLLECTION_API}/${userUrl}/${account}`
    );

    const { collectionAssets } = await fetchCollectionAssets.json();
    collectionAssets.push(data._id);

    const _result = await fetch(userEndpoint, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionAssets,
      }),
    });
    if (result.status === 201) {
      toast(
        <ToastDisplay
          type={"success"}
          title={"Transaction reciept"}
          description={"Mint Assets success !!!"}
        />
      );
      setTimeout(() => {}, 500);
      router.push("/profile/mycollection");
    }
  };

  return (
    <>
      <div className="heading">
        <h2>Create Collection</h2>
        <p>
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>
      <section className="vela-fluid">
        <div className="content">
          <div className="space-y-8 divide-y divide-gray-800">
            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                  Collection Name <span className="text-red-600">*</span>
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
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2"
                >
                  Cover Collection <span className="text-red-600">*</span>
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
                  Collection Description <span className="text-red-600">*</span>
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
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => (window.location = "/profile/mycollection")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => createCollection()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <main className="paper-card">
        <div className="bg-paper mx-auto p-2 md:p-8">
          <h2 className="modal-title">Create Collection</h2>
          <div className="mb-4">
            <span className="text-muted mt-6 mb-2 block">Collection</span>
            <p>
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="col-span-1 mb-4">
            <label className="label-modal">Cover Collection</label>
            <div className="dropzone-theme">
              <div className="space-y-1 text-center">
                <div className="flex text-sm justify-center">
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
                </div>
                <p>
                  Upload file or drag and drop with PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1 mb-4">
            <label className="label-modal">Collection Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-1 mb-4">
            <label className="label-modal">Collection Description</label>
            <textarea
              rows="3"
              className="form-control text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <p className="text-sm">Write a few sentences about yourself.</p>

          <div className="pt-5">
            <div className="flex justify-center xl:justify-end flex-wrap">
              <button
                type="button"
                className="btn-theme btn-secondary"
                onClick={() => (window.location = "/profile/mycollection")}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => createCollection()}
                className="btn-theme btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </main> */}
    </>
  );
};

export default CreateCollectionPage;
