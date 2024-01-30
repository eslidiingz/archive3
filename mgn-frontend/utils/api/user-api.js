import Config from "../../configs/config";

const HOST_ENDPOINT = Config.REST_API_URL;

export const signIn = async (walletAddress) => {
  try {
    const res = await fetch(`${HOST_ENDPOINT}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });

    const userData = await res.json();

    return userData || null;
  } catch (err) {
    return null;
  }
};

export const updateName = async (name, accessToken) => {
  try {
    const res = await fetch(`${HOST_ENDPOINT}/users/update/name`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const updated = await res.json();

    return updated?._id ? updated : null;
  } catch (err) {
    return null;
  }
};
