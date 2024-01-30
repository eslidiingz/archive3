import Config from "../config";

const registerEndpoint = "register";
const registerUri = `${Config.COLLECTION_API}/${registerEndpoint}`;

export const saveRegister = async (reqBody) => {
  const register = await fetch(registerUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  return await register.json();
};
