import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";

const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			rpc: {
				555: "https://rpc.velaverse.io/",
			},
			chainId: 555,
		},
	},
};

export function modalConnect() {
	if (typeof window.ethereum === "undefined") return null;

	return new Web3Modal({
		// network: "mainnet", // optional
		cacheProvider: true, // optional
		providerOptions, // required
	});
}

export function connectProvider(_instance = null) {
	if (typeof window.ethereum === "undefined") return null;

	const instance = _instance ? _instance : window.ethereum;

	//   return new providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

	return new providers.Web3Provider(instance);

	// return new providers.Web3Provider(instance);
}
