import Config from "../config";

const collectionEndpoint = "collections";
const collectionUri = `${Config.COLLECTION_API}/${collectionEndpoint}`;

export const fetchImageBucket = (image) => {
  const url = `${Config.COLLECTION_API}/images/${image}`;
  return url;
};

export const fetchCollectionList = async (account) => {
  const findCollection = await fetch(`${collectionUri}?owner=${account}`);
  return await findCollection.json();
};

export const fetchAssetCollection = async (collection) => {
  const find = await fetch(`${collectionUri}/${collection}`);
  return await find.json();
};

export const fetchCollectionByAssetId = async (id) => {
  const find = await fetch(`${collectionUri}/asset/${id}`);
  return await find.json();
};

export const putAssetCollection = async (id, data) => {
  const json = await fetch(`${collectionUri}/assets/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await json;
};

export const putHolderCollection = async (id, data) => {
  const json = await fetch(`${collectionUri}/holder/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await json;
};

export const putTransactionCollection = async (id, data) => {
  const json = await fetch(`${collectionUri}/transaction/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await json;
};
