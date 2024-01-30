// src/context/state.js
import { createContext, useContext } from "react";
import { ethers } from "ethers";

const AppContext = createContext();
const Provider = ({ children }) => {
  let data;
  data["number"] = 1234;
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
};

export const useConfig = () => useContext(AppContext);
export default Provider;
