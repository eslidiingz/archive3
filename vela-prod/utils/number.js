import Web3 from "web3";
import dayjs from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";

export const numberFormat = (n) => {
  if (n != 0) {
    return parseFloat(n)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return parseFloat(n).toFixed(2);
  }
};

//ส่งจำนวนชั่วโมง แปลงเป็นวินาที
export const setTimestamp = (hours = 1) => {
  if (hours <= 0) return 0;
  const timestamp = new Date();
  const millisecond = hours * 60 * 60 * 1000;
  const expiration = Math.round(timestamp.getTime()) + millisecond;

  return Math.ceil(expiration / 1000);
};

export const convertTimestampToBlock = (value) => {
  return Math.ceil(value / 1000);
};

export const toTimestamp = (strDate) => {
  var datum = Date.parse(strDate);
  return datum / 1000;
};

export const untilTime = (timestamp) => {
  dayjs.extend(localizedFormat);
  const datetime = dayjs(timestamp * 1000).format("LLL");
  return datetime;
};

export const convertEthToWei = (ether) => {
  try {
    return Web3.utils.toWei(ether.toString(), "ether");
  } catch (e) {
    console.log("%c ===== convertEthToWei =====", "color:red;");
    return;
  }
};
export const convertWeiToEther = (wei) => {
  return parseFloat(Web3.utils.fromWei(wei.toString(), "ether"));
};
export const formatAuctionTime = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let datevalues = [
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    // date.getSeconds(),
  ];
  return datevalues; //=> [3, 25, 23, 0]
};
