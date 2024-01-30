import Web3 from "web3";
import tokenAbi from "/utils/abis/token.json";
import landABI from "/utils/abis/land.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const tokenAddress = process.env.CLASS_TOKEN_ADDR;
const landAddress = process.env.LAND_ADDR;
const smLand = new web3.eth.Contract(landABI, landAddress);
