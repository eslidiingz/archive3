import Config from "../../configs/config";

const HOST_ENDPOINT = Config.REST_API_URL;

export const insertLand = async (data) => {
  try {
    if (!data?.walletAddress) return false;

    const response = await fetch(`${HOST_ENDPOINT}/admin/land`, {
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
