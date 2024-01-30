// modules : react
import { useEffect } from "react";

// modules : crypto
import Web3 from "web3";
import { MetaMaskProvider } from "metamask-react";

// css
import "tailwindcss/tailwind.css";
// import "/public/css/main.css";
// import "/public/css/button.css";
// import "/public/css/datepicker.css";
// import "/public/css/timepicker.css";
// import "/public/css/layout.css";

// components
import Footer from "/components/layouts/footer";
import Header from "/components/layouts/header";
import Menu from "/components/layouts/menu";

//Other
import "/utils/NProgress";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { web3 } from "/utils/web3/init";
import Config from "/utils/config.json";
import hasWeb3 from "/utils/web3/validator";

const switchAccount = async () => {
  if (!hasWeb3()) return;
  try {
    await window.ethereum.on("accountsChanged", (account) => {
      location.reload();
    });
  } catch (error) {
    console.log(error);
  }
};

const getNetworkId = async () => {
  if (!hasWeb3()) return 0;
  const currentChainId = await web3.eth.net.getId();
  return currentChainId;
};

const switchNetwork = async (chainId) => {
  if (!hasWeb3()) return;
  const currentChainId = await getNetworkId();

  if (currentChainId !== chainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.utils.toHex(chainId) }],
      });
    } catch (error) {
      if (error.code === 4902) {
        alert("add this chain id");
      }
    }
  }
};

const getLibrary = (provider) => {
  return new Web3(provider);
};
let totalHeight = 0;

function App({ Component, pageProps }) {
  useEffect(() => {
    switchNetwork(4);
    switchAccount();
    // const header = document.getElementById("header");
    // const footer = document.getElementById("footer");
    // totalHeight =
    //   parseFloat(header.offsetHeight) + parseFloat(footer.offsetHeight);
  }, []);
  return (
    <>
      <MetaMaskProvider>
        <div className="min-h-full">
          <div className="bg-gray-800 pb-32">
            <Header />
            <div
              className="contentLayout"
              style={{ minHeight: "calc(100vh - " + totalHeight + "px)" }}
            >
              {/* {Config.openProcess && (
            <div className="contentLayoutMenu">
              <div className="contentLayoutMenu-top"></div>
              <div className="contentLayoutMenu-body">
                <Menu />
              </div>
              <div className="contentLayoutMenu-bottom"></div>
            </div>
          )} */}

              <Component {...pageProps} />
            </div>
            {/* <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
        /> */}
            {/* <Footer /> */}
          </div>
        </div>
      </MetaMaskProvider>
    </>
  );
}

export default App;
