import { useState } from "react";
import {
  untilTime,
  convertWeiToEther,
  convertEthToWei,
  numberFormat,
} from "../../utils/number";
import ButtonState from "../button/button-state";
import {
  auctionContract,
  getWalletAccount,
  tokenContract,
  landStorageContract,
} from "../../utils/web3/init";
import { toast } from "react-toastify";
import { ToastDisplay } from "../ToastDisplay";


const BuyLand = (props) => {
    const [loading, setLoading] = useState(false);
    const onClose = (event) => {
        props.onClose && props.onClose(event);
    };
    if(!props.show) return null
    const buyLand = async () => {
        let account = await getWalletAccount();
        
    }
}