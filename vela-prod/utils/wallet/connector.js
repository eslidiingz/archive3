import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

export function getWalletAddress(wallet_address) {
  let prefix = wallet_address;
  let subfix = wallet_address;

  prefix = prefix.slice?.(0, 6);
  subfix = subfix.slice?.(subfix.length - 4);

  return prefix + "..." + subfix;
}
