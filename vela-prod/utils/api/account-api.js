import Config from "../config";

const userEndpoint = "users";
const userUrl = `${Config.COLLECTION_API}/${userEndpoint}`;

export const registerByOAuth = async (data) => {
  try {
    const response = await fetch(`${userUrl}/registerByOAuth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch {
    return {
      error: {
        status: 500,
        message: `Failed to sign in with ${data.provider}.`
      }
    };
  }
};

export const fetchUserData = async (account) => {
  try {
    const findByAddress = await fetch(`${userUrl}?address=${account}`);
    return await findByAddress.json();
  } catch {
    return null;
  }
};

export const findUserById = async (id) => {
  try {
    const findByAddress = await fetch(`${userUrl}/${id}`);
    return await findByAddress.json();
  } catch {
    return null;
  }
};
