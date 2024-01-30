import Config from "../../configs/config";

const HOST_ENDPOINT = Config.REST_API_URL;

export const getAllItems = async () => {
  try {
    const response = await fetch(`${HOST_ENDPOINT}/assets/getAll`);
    const items = await response.json();
    return items || [];
  } catch {
    return [];
  }
};

export const insertItem = async (data) => {
  try {
    if (!data?.walletAddress) return false;
    const response = await fetch(`${HOST_ENDPOINT}/admin/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result?.nModified ? true : false;
  } catch {
    return false;
  }
};


export const getItemTypes = async () => {
  try {
    const response = await fetch(`${HOST_ENDPOINT}/metadata/type/item`);
    const items = await response.json();
    return items || {};
  } catch {
    return {};
  }
};
