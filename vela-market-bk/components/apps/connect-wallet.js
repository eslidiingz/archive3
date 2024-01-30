import { useMetaMask } from "metamask-react";
import { getWalletAddress } from "../../utils/wallet/connector";

const ConnectWallet = (props) => {
  const { status, connect, account } = useMetaMask();

  if (status === "initializing")
    return (
      <button className="topbar-fill-btn">
        Synchronisation with MetaMask ongoing...
      </button>
    );

  if (status === "unavailable")
    return (
      <button className="topbar-fill-btn">
        MetaMask not available
      </button>
    );

  if (status === "notConnected")
    return (
      <button
        onClick={connect}
        className="topbar-fill-btn"
      >
        Connect Wallet
      </button>
    );

  if (status === "connecting")
    return (
      <button className="topbar-fill-btn">
        Connecting...
      </button>
    );

  if (status === "connected")
    return (
      <button className="topbar-fill-btn">
        {getWalletAddress(account)}
      </button>
    );

  return null;
};
export default ConnectWallet;
