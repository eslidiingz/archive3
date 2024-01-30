// import Footer from "./Footer";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { web3Modal, web3Provider } from "../../utils/providers/connector";
import { useWalletContext } from "../../context/wallet";
import Swal from "sweetalert2";
import { ethers, formatEther, formatUnits } from "ethers";

import { getUsdcBalance, getIsApprove } from "../../models/BUSDToken";
import { balanceOfWallet, getTokenSymbol } from "../../models/MGNToken";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Config from "../../configs/config";

function Mainlayout({ children }) {

  const [shortenWallet, setShortenWallet] = useState("");
  const [toggleViewMode, setToggleViewMode] = useState(false);


  const { wallet, walletAction } =
    useWalletContext();


  const handleWallet = async () => {
      if (wallet) {
        // innitialize
        console.log(wallet, "Log from handle wallet")
      } else {
        await connectWallet();
      }
      return true;
     
  };

  // console.log(walletAction)
  const connectWallet = async () => {

    try {
      if (typeof window.ethereum === "undefined") {
        Swal.fire(
          "Warning",
          "Please, Install metamark extension to connect DApp",
          "warning"
        );
        return;
      }
  
        const _wInstance = web3Modal();
        const _wProvider = web3Provider(await _wInstance.connect());
  
        const signer = _wProvider.getSigner();  
        const network = await _wProvider.getNetwork();
        const _wallet = await signer.getAddress();
        console.log(network.chainId, "LOG FRROM CONNECT WALLET");
        await switchNetwork(Config.CHAIN_ID)
        switchChainID();
        // if ( network.chainId !== Config.CHAIN_ID) {
          
        // }
  
        const _balance = await balanceOfWallet(_wallet);
  
        const _tokenSymbol = await getTokenSymbol();
        const _usdcBalance = await getUsdcBalance(_wallet);
  
  
        walletAction.store(_wallet);
        walletAction.setBalance((ethers.utils.formatEther(_balance)));
        walletAction.setToken(_tokenSymbol);
        walletAction.setUsdc((ethers.utils.formatEther(_usdcBalance)));
  

    } catch (e) {
      console.log(e);
    }
    
  };

  const switchNetwork = async (chainId) => {
    const currentChainId = await getNetworkId();

    if (currentChainId !== chainId) {
      try {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexValue(chainId).toString() }],
          })
          .then((res) => {
            location.reload();
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (error) {
        if (error.code === 4902) {
          console.log("add chain");
        }
      }
    }
  };

  const switchChainID = () => {
    console.log("Try to switch")
    try {
      window.ethereum.on("chainChanged", (chain) => {
        console.log("Chain on event : ", chain)
        if (Number(chain) !== Config.CHAIN_ID) {
          switchNetwork(Config.CHAIN_ID);
          location.reload();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getNetworkId = async () => {
    try {
      const provider = web3Provider();
      const { chainId } = await provider?.getNetwork();

      return chainId;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (wallet) {
      window.ethereum.on('accountsChanged', (accounts) => {
        connectWallet();
        location.reload();
      })
    }
  }, [wallet]);



  return (
    <>
      <div className="main-layout position-relative">
        <Topbar
          handleWallet={handleWallet}
        />
        <div className="layout-wrapper">
          <div className="sidebar d-lg-block d-none"><Sidebar /></div>
          <div className="content">{children}</div>
          <Footer/>
        </div>
      </div>
    </>
  );
}

export default Mainlayout;
