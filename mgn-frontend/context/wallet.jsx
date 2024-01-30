import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export function useWalletContext() {
  return useContext(WalletContext);
}


function WalletProvider(props) {

  const [wallet, setWallet] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [usdcBalance, setUsdcBalance] = useState(null);

  function store(_address) {
    setWallet(_address);
  }

  const setBalance = (_balance) => {
    setWalletBalance(_balance);
  };

  const setToken = (_symbol) => {
    setTokenSymbol(_symbol);
  };

  const setUsdc = (_usdcBalance) => {
    setUsdcBalance(_usdcBalance);
  };

  const walletStore = {
    wallet,
    walletBalance,
    tokenSymbol,
    usdcBalance,
    walletAction: {
      store,
      setBalance,
      setToken,
      setUsdc,
    },
  };


  return (
    <WalletContext.Provider value={walletStore}>
      {props?.children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;
