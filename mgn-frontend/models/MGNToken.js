import { ethers } from "ethers";
import { unlimitAmount } from "../utils/misc";
import Config, { debug } from "/configs/config";
import { dAppChecked, smartContact } from "/utils/providers/connector";

export const smartContractMgnToken = (providerType = false) => {
  return smartContact(Config.TOKEN_CA, Config.TOKEN_ABI, providerType);
};

/** Function with connected provider required (On Chian) */
export const balanceOfWallet = async (_walletAddress = null) => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    const sc = smartContractMgnToken();
    console.log(sc,"from balanceOfWallet MGN Token");
    res = await sc.balanceOf(_walletAddress);
    return res;
  } /** End Check dApp */

  return res;
};

export const allowanced = async (
  _owner,
  _spender,
  _contractAddress = null,
  _IERC20 = true
) => {
  let allowancedAmount = null;

  /** Check dApp before action anything */
  if (await dAppChecked()) {
    let ca = _contractAddress !== null ? _contractAddress : Config.BUSD_CA;
    let abi = _IERC20 === false ? Config.ERC20_ABI : Config.BUSD_ABI;
    let sm = smartContact(ca, abi);

    allowancedAmount = await sm.allowance(_owner, _spender);

    if (debug) {
      console.log(
        `%c===== allowanced(_owner, _spender) CA: ${ca} [${[
          _owner,
          _spender,
        ]}] =====>`,
        "color: skyblue",
        `${allowancedAmount}`
      );
    }
  } /** End check dApp */

  return allowancedAmount;
};

export const approveToken = async (
  _spender,
  _contractAddress = null,
  _IERC20 = false
) => {
  let status = false;

  /** Check dApp before action anything */
  if (await dAppChecked()) {
    let ca = _contractAddress !== null ? _contractAddress : Config.BUSD_CA;
    let abi = _IERC20 === true ? Config.BUSD_ABI : Config.ERC20_ABI;
    let sm = smartContact(ca, abi);

    const approved = await sm.approve(_spender, unlimitAmount);

    if (debug) {
      console.log(
        `%c===== approveToken(_spender, _contractAddress, _IERC20) [${[
          _spender,
          _contractAddress,
          _IERC20,
        ]}] =====>`,
        "color: skyblue",
        `${approved}`
      );
    }

    let txBlockConfirm = await approved.wait();
    status = txBlockConfirm.status;
  }

  return status;
};

/** Retrive symbol of token on chain */
export const getTokenSymbol = async (
  _contractAddress = null,
  _IERC20 = true
) => {
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    const ca = _contractAddress !== null ? _contractAddress : Config.TOKEN_CA;
    const abi = _IERC20 === true ? Config.TOKEN_ABI : Config.TOKEN_ABI;

    const sm = smartContact(ca, abi);

    return await sm.symbol();
  } /** End Check dApp */
};
