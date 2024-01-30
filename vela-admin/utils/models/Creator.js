import Config from "configs/config";

const $baseUri = `${Config.COLLECTION_URI}`;

const fetchApi = async (uri) => {
  let res = await fetch(`${$baseUri}/${uri}`);
  return await res.json();
};

export const getCreators = async (queryString = null) => {
  let uri = `/whitelists${queryString}`;
  let creators = await fetchApi(uri);
  return creators;
};

export const getCreatorById = async (whitelistId) => {
  if (!whitelistId) return null;
  let uri = `/whitelists/${whitelistId}`;
  let creator = await fetchApi(uri);
  return creator;
};
