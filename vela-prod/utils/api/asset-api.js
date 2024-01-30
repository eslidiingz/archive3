import Config from "../config";

const assetEndpoint = "assets";
const assetUrl = `${Config.COLLECTION_API}/${assetEndpoint}`;

export const getAssetById = async (data) => {
  const _result = await fetch(`${assetUrl}/${data}`);
  return await _result.json();
};

export const getAssetByAddressToken = async (address, token) => {
  const _result = await fetch(`${assetUrl}?address=${address}&token=${token}`);
  return await _result.json();
};

export const createAssetList = async (data) => {
  const _result = await fetch(`${assetUrl}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await _result;
};

export const updateAssetList = async (id, data) => {
  const json = await fetch(`${assetUrl}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await json;
};
