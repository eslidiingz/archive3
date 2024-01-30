import Config from "../config";

const userEndpoint = "users";
const userUrl = `${Config.COLLECTION_API}/${userEndpoint}`;

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
