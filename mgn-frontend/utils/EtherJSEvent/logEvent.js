import {ethers, Contract} from "ethers"
import numeral from "numeral"
import {formatEther} from "ethers/lib/utils"
import {abiMarket} from "../../abis"
import Config from "../config"
import {connectProvider} from "../connector/provider"
import {getAssetByAddress, getAssetByAddressToken} from "/utils/api/asset-api"

const BwToken = Config.BWC_ADDR
const BwMarketAdd = Config.BWMarket_ADDR
const BwNFT = Config.BWNFT_ADDR

export async function getListOfCreateOrder() {
  const web3Provider = connectProvider()
  const contract = new Contract(
    BwMarketAdd,
    abiMarket,
    web3Provider.getSigner(0)
  )
  const eventFilter = contract.filters.OrderCreatedEvent()
  const queryFilters = await contract.queryFilter(
    eventFilter,
    19659352,
    19659952
  )
  return queryFilters
}
