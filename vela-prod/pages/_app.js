// modules : react
import { createContext, useContext, useEffect } from "react";

// modules : crypto
import { MetaMaskProvider } from "metamask-react";

import { SessionProvider } from "next-auth/react";

// css
import "tailwindcss/tailwind.css";
import "/public/css/main.css";
import "/public/css/button.css";
import "/public/css/datepicker.css";
import "/public/css/timepicker.css";

import "/public/font-awesome/css/all.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import "/public/css/layout.css";
import "/public/css/layout-2.css";

// components
import Footer from "../components/layouts/footer";
import Header from "../components/layouts/header";
import Menu from "../components/layouts/menu";
import { useState } from "react";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { getWalletAccount, web3 } from "../utils/web3/init";
import { fetchUserData } from "../utils/api/account-api";
import Config from "/utils/config";
// import { MoralisProvider } from "react-moralis";
import { useRouter } from "next/router";
import Web3 from "web3";
import Link from "next/link";

export const WalletContext = createContext();

const switchAccount = () => {
  try {
    window.ethereum.on("accountsChanged", (account) => {
      location.reload();
    });
  } catch (error) {
    console.log(error);
  }
};

const getNetworkId = async () => {
  const currentChainId = await web3.eth.net.getId();
  return currentChainId;
};

const switchChainID = () => {
  try {
    window.ethereum.on("chainChanged", (chain) => {
      if (web3.utils.hexToNumber(chain) !== Config.CHAIN_ID) {
        switchNetwork(Config.CHAIN_ID);
        location.reload();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const switchNetwork = async (chainId) => {
  const currentChainId = await getNetworkId();

  if (currentChainId !== chainId) {
    try {
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(chainId) }],
        })
        .then((res) => {
          location.reload();
        })
        .catch((e) => {
          // alert("Reject confirm switch chain");
        });
    } catch (error) {
      if (error.code === 4902) {
        // alert("add this chain id");
      }
    }
  }
};

const fetchAccountUser = async () => {
  try {
    const account = await getWalletAccount();
    const { total } = await fetchUserData(account);
    if (total === 0) {
      const userEndpoint = "users";
      const userUrl = `${Config.COLLECTION_API}/${userEndpoint}`;
      const createUser = await fetch(`${userUrl}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: account,
          title: account,
          description: "",
        }),
      });
      const _r = await createUser.json();
    }
  } catch (error) {
    console.log(error);
  }
};

const App = ({ Component, pageProps }) => {
  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [metamask, setMetamask] = useState(false);
  const [currentChainStatus, setCurrentChainStatus] = useState(false);

  const [walletState, setWalletState] = useState({
    connected: false,
  });

  const router = useRouter();

  let totalHeight = 0;

  useEffect(() => {
    activate();
    // switchAccount();
    // switchNetwork();
    // switchChainID();
    // setWalletState({ connected: true });
    // setStatusChainId();
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", function () {
      setOpenMenuMobile(false);
      setActiveMenu(false);
    });
  }, [router]);

  const activate = async () => {
    // if (window.ethereum) console.log("has metamask");
    // else console.log("please install metamask");

    setMetamask(window.ethereum ? true : false);
    if (window.ethereum) {
      // const enable = await ethereum.request({ method: "eth_requestAccounts" });
      // console.log("Enable : ", enable)
      // if (enable[0]) {
      //   await fetchAccountUser();
      // }
    }
  };

  const setStatusChainId = async () => {
    let result = false;

    if (window.ethereum) {
      let chainId = window.ethereum.chainId;
      const myChainApprove = web3.utils.toHex(Config.CHAIN_ID);
      result = chainId == myChainApprove ? true : false;
    }
    setCurrentChainStatus(result);
    return result;
  };

  return (
    <>
      {/* <SessionProvider session={pageProps.session}> */}
      <WalletContext.Provider value={{ walletState, setWalletState }}>
        <MetaMaskProvider>
          {/* {currentChainStatus ? ( */}
          <>
            <Header metamask={metamask} />
            <div className="warper-content pt-16">
              <Component {...pageProps} />
            </div>
            <Footer />
          </>
          {/* ) : null}
            {!metamask && <Modal />}
            {!currentChainStatus && <ModalChainIdCurrent />} */}

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={false}
          />
        </MetaMaskProvider>
      </WalletContext.Provider>
      {/* </SessionProvider> */}
    </>
  );
};

const Modal = () => {
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: "100" }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="modal-global-size-meta transform transition-all">
          <div className="bg-modal-meta flex">
            <img
              className="metamask-logo"
              src={"/assets/image/logo-metamask.svg"}
            />
            <div className="text-center mb-4">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Please use metamask.
              </h3>
            </div>
            <div className="flex">
              <Link href={"https://metamask.io/download/"}>
                <a
                  className="button btn-theme btn-primary-long mr-0"
                  target={"_blank"}
                >
                  Install Metamask
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalChainIdCurrent = () => {
  const addCustomChain = async () => {
    await window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: web3.utils.toHex(Config.CHAIN_ID),
            chainName: "VELA1 Chain",
            nativeCurrency: {
              name: "CLASS",
              symbol: "CLASS",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.velaverse.io/"],
            blockExplorerUrls: ["https://exp.velaverse.io"],
          },
        ],
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: "100" }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="ModalChainIdCurrent"
    >
      <div
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 mx-auto"
        style={{ maxWidth: "1200px" }}
      >
        <div className="max-screen-theme mx-auto py-16 px-4 sm:py-24 sm:px-6 md:py lg:px-0 lg:flex lg:justify-between flex flex-col lg:flex-row relative">
          <div className="max-w-xl flex flex-col justify-center px-5 sm:px-10 lg:px-0 mx-auto mb-8 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white sm:text-4xl sm:tracking-tight lg:text-5xl header-text-market lg:mb-4 ">
              {/* Marketplace */}
              VELAVERSE
            </h2>
            <p className="mt-5 mb-5 text-xl header-text-market2">
              {/* Start building for free, then add a site plan to go live. Account
            plans unlock additional features. */}
              You are on wrong network.
              <br />
              Please switch to VELA1 CHAIN.
            </p>
            <div className="flex flex-row mt-5 items-center">
              <button
                className="btn-header mx-auto lg:w-40"
                onClick={() => addCustomChain()}
              >
                Add VELA1 Chain
              </button>
            </div>
            <div className="flex flex-row  mt-5 items-center">
              <button
                className="btn-header mx-auto lg:w-40"
                onClick={() => switchNetwork(Config.CHAIN_ID)}
              >
                Switch Chain
              </button>
            </div>
          </div>
          {/* <div className="mt-10 w-full max-w-xs mx-auto"> */}
          <div className="homme2">
            <img
              src={"/assets/image/items/land-2.png"}
              alt=""
              className="m-auto"
              width="80%"
            />
            {/* <div className="cloud2"> */}
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud1"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud2"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud3"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud4"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud5"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud6"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud7"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud8"
            />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
