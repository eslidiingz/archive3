export function formatAccount(address = "", width = 6) {
  if (!address) {
    return ""
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export const unlimitAmount =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
