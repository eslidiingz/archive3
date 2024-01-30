import Config from "../../utils/config";
import { web3 } from "../../utils/web3/init";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Example() {
  const router = useRouter();
  const [landCA, setLandCA] = useState();

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

  useEffect(() => {
    let _ca = "";
    if (router.query.mapName === "sut") {
      _ca = Config.LAND_SUT_ADDR;
    } else if (router.query.mapName === "oldtown") {
      _ca = Config.LAND_OLD_TOWN_ADDR;
    } else if (router.query.mapName === "crescentIsle") {
      _ca = Config.CRESCENT_ISLE_ADDR;
    } else {
      _ca = Config.LAND_ADDR;
    }

    setLandCA(_ca);
  }, [router.query]);

  return (
    <div
      className={
        router.pathname == "/login"
          ? "hidden"
          : "" || router.pathname == "/register"
          ? "hidden"
          : "" || router.pathname == "/renew-password"
          ? "hidden"
          : "" || router.pathname == "/login/passcode"
          ? "hidden"
          : ""
      }
    >
      <footer className="footer-vela">
        <div className="footer-left">
          <div className="contact-address">
            <div className="contact-address-title">Land Contract Address :</div>
            <div className="contact-address-desc">{landCA}</div>
          </div>
          <div className="contact-address">
            <div className="contact-address-title">
              Building Contract Address :
            </div>
            <div className="contact-address-desc">{Config.GENNFT_ADDR}</div>
          </div>
        </div>
        <div className="footer-right">
          <button
            className="m-0 btn btn-lg btn-primary"
            onClick={() => addCustomChain()}
          >
            Add VELA1 Chain
          </button>
        </div>
        {/* <div className="mx-auto py-4 px-4 sm:px-4 md:items-center md:justify-between lg:px-4">
          <div className="md:mt-0 md:order-1">
            <p className="text-center text-gray-400 justify-between text-sm md:text-lg">
              <span>Land Contract Address : {Config.LAND_ADDR}</span>
              <br />
              <span>Building Contract Address : {Config.GENNFT_ADDR}</span>
            </p>
            <div className="flex justify-center mt-1">
              <button
                className="btn btn-lg btn-primary mr-2"
                onClick={() => addCustomChain()}
              >
                Add VELA1 Chain
              </button>
            </div>
          </div>
        </div> */}
      </footer>
    </div>
  );
}
