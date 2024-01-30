const { providers, Contract } = require("ethers");
const services = require("../services/transaction/transactionService");
const abis = require("../abis/phuket-land.json");
const { pool } = require("../connections/database");

const methods = {
  async getTransaction(req, res) {
    try {
      const transactions = await services.findAllTransactions();
      return res.json({ success: true, data: transactions, status: 200 });
    } catch {
      return res.json({ success: false, data: null, status: 500 });
    }
  },
  async fetchAllTransaction(req, res) {
    try {
      const provider = new providers.JsonRpcProvider(
        "https://rpc.velaverse.io"
      );

      const contract = new Contract(
        "0x2ac014d26f2f19f0c4f0f85432f663ab183dd44b",
        abis,
        provider
      );

      // const eventList = contract.filters.landTransfered(
      //   null,
      //   null,
      //   null,
      //   null,
      //   "buy lands"
      // );
      // console.log(eventList);

      const supply = await contract.totalSupply();
      const client = await pool.connect();
      for (let index = 0; index < parseInt(supply); index++) {
        const _tokenId = await contract.tokenByIndex(index);
        const _ownerOf = await contract.ownerOf(parseInt(_tokenId));

        const { x, y } = await contract.getLandsByToken(_tokenId);

        console.log(parseInt(_tokenId), _ownerOf);
        console.log(x, y);
        const query = {
          text: `INSERT INTO transactions(
          admin_wallet_address,
          wallet_address,
          transaction_hash,
          token_id,
          coordinate_x,
          coordinate_y,
          map_name)
          VALUES($1, $2, $3, $4, $5, $6, $7)`,
          values: [
            _ownerOf,
            _ownerOf,
            "",
            JSON.stringify([parseInt(_tokenId)]),
            JSON.stringify([parseInt(x)]),
            JSON.stringify([parseInt(y)]),
            "oldtown",
          ],
        };
        client.query(query);
      }
      return res.json({ success: true, status: 200 });
    } catch (e) {
      return res.json({ success: false, status: 500 });
    }
  },
  async insertTransaction(req, res) {
    try {
      const inserted = await services.insertTransaction(req.body);
      return res.json({ success: inserted ? true : false, status: 200 });
    } catch {
      return res.json({ success: false, status: 500 });
    }
  },
};

module.exports = { ...methods };
