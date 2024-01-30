require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function main() {
  // const landBSC = await ethers.getContractAt(
  //   "Land",
  //   "0x9880cc2A5Bfa072E7D3f725C4Ff1aC77220aeD9A"
  // );

  const abi = [
    {
      inputs: [{ internalType: "address", name: "_token", type: "address" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256[]",
          name: "zone",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "x",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "y",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "tokenId",
          type: "uint256[]",
        },
      ],
      name: "bought",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferred",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MINTER_ROLE",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256[]", name: "xStart", type: "uint256[]" },
        { internalType: "uint256[]", name: "xEnd", type: "uint256[]" },
        { internalType: "uint256[]", name: "yStart", type: "uint256[]" },
        { internalType: "uint256[]", name: "yEnd", type: "uint256[]" },
      ],
      name: "addRestrictedArea",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "baseUrl",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256[]", name: "_zone", type: "uint256[]" },
        { internalType: "uint256[]", name: "_x", type: "uint256[]" },
        { internalType: "uint256[]", name: "_y", type: "uint256[]" },
      ],
      name: "buyLands",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_address", type: "address" }],
      name: "getLandWithOwner",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "zone", type: "uint256" },
            { internalType: "uint256", name: "x", type: "uint256" },
            { internalType: "uint256", name: "y", type: "uint256" },
            { internalType: "address", name: "wallet", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          internalType: "struct Land.sLand[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "getLandWithTokenId",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "zone", type: "uint256" },
            { internalType: "uint256", name: "x", type: "uint256" },
            { internalType: "uint256", name: "y", type: "uint256" },
            { internalType: "address", name: "wallet", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          internalType: "struct Land.sLand",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getLands",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "zone", type: "uint256" },
            { internalType: "uint256", name: "x", type: "uint256" },
            { internalType: "uint256", name: "y", type: "uint256" },
            { internalType: "address", name: "wallet", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          internalType: "struct Land.sLand[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
      name: "getRoleAdmin",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "hasRole",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pricePerLand",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "xStart", type: "uint256" },
        { internalType: "uint256", name: "xEnd", type: "uint256" },
        { internalType: "uint256", name: "yStart", type: "uint256" },
        { internalType: "uint256", name: "yEnd", type: "uint256" },
      ],
      name: "removeRestrictedArea",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "_data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "_url", type: "string" }],
      name: "setBaseUrl",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_price", type: "uint256" }],
      name: "setPricePerLand",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "tokenByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const provider = ethers.provider;
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey);
  wallet.provider = provider;
  const signer = wallet.connect(provider);

  const landBSC = new ethers.Contract(
    "0x9880cc2A5Bfa072E7D3f725C4Ff1aC77220aeD9A",
    abi,
    signer
  );

  const lands = await landBSC.getLands();

  console.log(lands);

  // const migrate = await smartContract.migrateLands(
  //     owner.address,
  //     owner.x,
  //     owner.y
  //   );
  //   console.log(migrate);
  //   await migrate.wait();

  // console.log(landBSC);

  // const owners = [
  //   {
  //     address: "0x782beb424B3B39a73f48738c19CAE82Ff9F17549",
  //     name: "ESDZ",
  //     x: [0, 0, 0],
  //     y: [0, 1, 2],
  //   },
  //   {
  //     address: "0x14eD29438789299b0C69f698e9C9ea4B40e49625",
  //     name: "SPAK",
  //     x: [1, 1, 1],
  //     y: [0, 1, 2],
  //   },
  //   {
  //     address: "0x0203Fb006c0D2e1466D8765F3Ce664bCde10e755",
  //     name: "Ter",
  //     x: [2, 2, 2],
  //     y: [0, 1, 2],
  //   },
  //   {
  //     address: "0x7E1494B8EcF5d853829aD0e0D710340aFd217C98",
  //     name: "Rain",
  //     x: [3, 3, 3],
  //     y: [0, 1, 2],
  //   },
  // ];
  // const artifact = require("../artifacts/contracts/Land.sol/Land.json");
  // const abi = artifact.abi;
  // const provider = ethers.provider;
  // const privateKey = process.env.PRIVATE_KEY;
  // const wallet = new ethers.Wallet(privateKey);
  // wallet.provider = provider;
  // const signer = wallet.connect(provider);
  // const smartContract = "0xAaD80A77768C1D6D1ed542be3344865407e412D5";
  // const smLand = new ethers.Contract(smartContract, abi, signer);
  // const xxx = await smLand.prevSupply();
  // console.log(xxx);
  // const smartContract = await ethers.getContractAt(
  //   "Land",
  //   "0xAaD80A77768C1D6D1ed542be3344865407e412D5"
  // );
  // console.log(await smartContract.prevSupply());
  // for (const owner of owners) {
  //   const arrX = `${owner.x}`;
  //   const arrY = `${owner.y}`;
  //   const migrate = await smartContract.migrateLands(
  //     owner.address,
  //     owner.x,
  //     owner.y
  //   );
  //   console.log(migrate);
  //   await migrate.wait();
  //   console.log(`Migrate to ${owner.address} Coordinate: ${arrX} : ${arrY}`);
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
