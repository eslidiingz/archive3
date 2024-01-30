import Config from "../config";

const WhitelistEndpoint = "whitelists";
const WhitelistUrl = `${Config.COLLECTION_API}/${WhitelistEndpoint}`;

export const fetchWhitelistUser = async (address) => {
  const _data = await fetch(`${WhitelistUrl}?address=${address}`);
  return await _data.json();
};

export const updateWhitelistUser = async (id, data) => {
  const _result = await fetch(`${WhitelistUrl}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await _result;
};

export const saveWhitelistUser = async (data) => {
  const _result = await fetch(`${WhitelistUrl}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await _result;
};
