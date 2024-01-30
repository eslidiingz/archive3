const jwt = require("jsonwebtoken");
const { ErrorBadRequest } = require("../configs/errorMethods");
const secret = require("../configs/app").secret;
const pool = require("../configs/databases").mysql();
const { verify } = require("../helpers/encrypt.helper");

const methods = {
  generateJwt(data = null) {
    if (!data) return null;
    return jwt.sign(data, secret, { expiresIn: "24hr" });
  },
  async findByCredential(credentials) {
    return new Promise(async (resolve, reject) => {
      try {
        pool.getConnection(async (err, connection) => {
          if (err) {
            connection.release();
            return resolve({
              status: false,
              result: null,
              message: "Failed to sign in.",
            });
          } 

          connection.query(
            "SELECT `username`,`password`,nickname,model_id,skin_tone,hair,head,upper,lower,foot,owner,email FROM `character` WHERE `username` = ?",
            [credentials.username],
            async (error, rows) => {
              if (error) {
                connection.release();
                return resolve({
                  status: false,
                  result: null,
                  message: "Failed to sign in.",
                });
              }
              
              if (rows?.length) {
                const account = rows[0];
                const verifiedPassword = await verify(credentials.password, account.password);

                if (!verifiedPassword) {
                  connection.release();
                  return resolve({
                    status: false,
                    result: null,
                    message: "Password is not correct.",
                  });
                }

                delete account["password"];

                const token = this.generateJwt({ sender: account.owner, _name: account.nickname });

                connection.release();
                return resolve({
                  status: true,
                  result: { address: account.owner, token }
                });
              } else {
                connection.release();
                return resolve({
                  status: false,
                  result: null,
                  message: "Account was not found.",
                });
              }
            }
          );
        });
      } catch (err) {
        connection.release();
        resolve({
          status: false,
          result: null,
          message: "Failed to sign in.",
        });
      }
    });
  },
};

module.exports = { ...methods };
