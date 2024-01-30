import { BigNumber, ethers, providers } from "ethers";
import { unlimitAmount } from "/utils/misc";
import Config, { debug } from "/configs/config";
import { dAppChecked, smartContact } from "../utils/providers/connector";
import { web3Provider } from "../utils/providers/connector";

export const smartContractClaim = (providerType=false) => {
  return smartContact(Config.CLAIM_CA, Config.CLAIM_ABI, providerType);
};

export const callClaimLand = async (_tokenId) => {
  if (debug) console.log(`%c>>>>> callClaimLand (_tokenId) [${_tokenId}] >>>>>`, "color: black");

  try {
    let claimLand;
    /** Check dApp before action anything */
    if (await dAppChecked()) {
  
        const sm = smartContractClaim();
        claimLand = await sm.claimLand(_tokenId);
        claimLand = await claimLand.wait(6);
        console.log({claimLand})
        return claimLand;
  
    } /** End Check dApp */

    return false;

  } catch (e){
    console.error(e)
    return false;
  }
};
