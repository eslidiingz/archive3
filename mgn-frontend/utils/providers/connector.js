import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Contract, providers } from "ethers";
import Swal from "sweetalert2";
import Config, { debug } from "../../configs/config";

var chainNumber = Config.CHAIN_ID;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        97: "https://data-seed-prebsc-1-s2.binance.org:8545/",
        56: "https://bsc-dataseed.binance.org/",
        80001: "https://matic-mumbai.chainstacklabs.com",
      },
      chainId: Config.CHAIN_ID,
    },
  },
};

export function web3Modal() {
  if (typeof window.ethereum === "undefined") return null;

  return new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });
}

export function web3Provider(_instance = null) {
  try {
    if (typeof window.ethereum === "undefined") return null;


    const instance = _instance != null ? _instance : window.ethereum;
    return new providers.Web3Provider(instance);
  
    // return new providers.Web3Provider(instance);

  } catch (err) {
    console.log("function web3Provider error", err);
    return err;
  }

}

export const isMetaMaskConnected = async () => {
  try {
    if (await dAppChecked()) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      return accounts.length > 0;
    }
    return false;
  } catch {
    return false;
  }
};

export const dAppChecked = async (required = false) => {
  let status = false;
  if (typeof window.ethereum === "undefined") {
    Swal.fire(
      "Warning",
      "Please, Install metamark extension to connect DApp &^*&!^*^%#!",
      "warning"
    );
    return status;
  }
  status = true;
  return status;
};

export const smartContact = (_contractAddress, abi, providerType = false) => {
  let provider;
  let instantSmartContract;
  if (debug) {
    console.log(
      `%c===== SmartContract Connecting to ... [${_contractAddress}] [jsonRPC = ${providerType}] =====>`,
      "color: skyblue"
    );
  }

  if (providerType === true) {
    provider = new providers.JsonRpcProvider(Config.JSON_RPC);

    instantSmartContract = new Contract(_contractAddress, abi, provider);
  } else {
    provider = web3Provider();

    const signer = provider.getSigner();
    instantSmartContract = new Contract(_contractAddress, abi, signer);
  }

  if (debug) {
    console.log(
      `%c===== SmartContract Connected [${_contractAddress}] =====>`,
      "color: skyblue",
      instantSmartContract
    );
  }

  return instantSmartContract;
};
