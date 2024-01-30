const pool = require("../configs/databases").mysql();
const { ErrorBadRequest } = require("../configs/errorMethods");
const { hash } = require("../helpers/encrypt.helper");

const methods = {
  async validateRegisterReqBody(reqBody = null) {
    return new Promise(async (resolve, reject) => {
      try {
        let validated = true;
        let errorMessages = [];

        const walletAddress = reqBody?.walletAddress?.trim() || null;
        if (!walletAddress) {
          validated = false;
          errorMessages.push("Wallet address is required");
        }

        const username = reqBody?.username?.trim() || null;
        if (!username) {
          validated = false;
          errorMessages.push("Username is required");
        } else {
          if (username.length > 50) {
            validated = false;
            errorMessages.push("Username length exceeds 50 characters");
          }
        }

        const confirmationPassword = reqBody?.confirm_password?.trim() || null;
        if (!confirmationPassword) {
          validated = false;
          errorMessages.push("Confirmation password is required");
        } else {
          if (confirmationPassword.length > 50) {
            validated = false;
            errorMessages.push("Confirmation password length exceeds 50 characters");
          }
        }

        const email = reqBody?.email?.trim() || null;
        if (email) {
          const mailFormat = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.){1,2}[a-zA-Z]{2,}))$/
          );
          if (mailFormat.test(email)) {
            if (email.length > 50) {
              errorMessages.push("Email length exceeds 50 characters");
              validated = false;
            }
          } else {
            validated = false;
          }
        }

        resolve({ validated, errorMessages });
      } catch (err) {
        return resolve({ validated: false, errorMessages: [err.message] });
      }
    });
  },
  async insertOrUpdate(data) {
    return new Promise(async (resolve, reject) => {
      try {
        pool.getConnection(async (err, connection) => {
          if (err) {
            connection.release();
            return reject(ErrorBadRequest("Failed to register."));
          }

          connection.query("SET FOREIGN_KEY_CHECKS=0", (error) => {
            if (error) {
              connection.release();
              return reject(ErrorBadRequest("Failed to register."));
            }

            connection.query("SELECT id, `username`, model_id, nickname FROM `character` WHERE owner = ?", [data.walletAddress], async (error, rows) => {
              if (error) {
                connection.release();
                return reject(ErrorBadRequest("Failed to register."));
              }

              // Hashed password
              const hashedPassword = await hash(data.password);

              if (!hashedPassword) {
                connection.release();
                return reject(ErrorBadRequest("Failed to register."));
              }

              if (rows?.length) {
                const user = rows[0];
                if (!user?.username) {
                  const dataToUpdate = [data.username, hashedPassword, data.email, data.walletAddress, data.walletAddress];
                  connection.query("UPDATE `character` SET `username` = ?, `password` = ?, email = ?, nickname = ? WHERE owner = ?", dataToUpdate, (error) => {
                    connection.release();

                    if (error) return reject(ErrorBadRequest("This username already exist, please try another one."));

                    return resolve({
                      status: true,
                      message: "Registered successfully.",
                    });
                  });
                } else {
                  connection.release();
                  return reject(ErrorBadRequest("This wallet already exist, please try another one."));
                }
              } else {
                const dataToInsert = [data.walletAddress, data.username, hashedPassword, data.email, data.walletAddress, 1, null, null, null, null, null, null];
                connection.query(
                  "INSERT INTO `character` (`owner`,`username`,`password`, email, nickname, model_id, hair, head, upper, lower, foot, skin_tone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                  dataToInsert,
                  (error) => {
                    if (error) {
                      let errorCode = error?.code;
                      let errorMessage = errorCode === 'ER_DUP_ENTRY' ? 'This username already exist, please try another one' : 'Failed to register.';
                      connection.release();
                      return reject(ErrorBadRequest(errorMessage));
                    }

                    connection.release();

                    return resolve({
                      status: true,
                      result: true,
                      message: "Registered successfully.",
                    });
                  }
                );
              }
            });
          });
        });
      } catch (err) {
        connection.release();
        return reject(ErrorBadRequest("Failed to register."));
      }
    });
  },
};

module.exports = { ...methods };
