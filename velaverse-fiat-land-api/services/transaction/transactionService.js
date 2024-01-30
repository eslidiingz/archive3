const { pool } = require("../../connections/database");

const services = {
  async findAllTransactions() {
    return new Promise(async (resolve, reject) => {
      try {
        const client = await pool.connect();

        const response = await client.query(`
        SELECT 
          admin_wallet_address,
          wallet_address,
          transaction_hash,
          token_id,
          coordinate_x,
          coordinate_y,
          created_at
        FROM transactions`);
        client.release();
        resolve(response?.rows || []);
      } catch {
        reject(null);
      }
    });
  },
  async insertTransaction(data) {
    return new Promise(async (resolve, reject) => {
      try {
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
            data.admin_wallet_address,
            data.wallet_address,
            data.transaction_hash,
            JSON.stringify(data.token_id),
            JSON.stringify(data.coordinate_x),
            JSON.stringify(data.coordinate_y),
            data.map_name,
          ],
        };

        const inserted = await pool.query(query);

        if (inserted) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch {
        reject(false);
      }
    });
  },
};

module.exports = { ...services };
