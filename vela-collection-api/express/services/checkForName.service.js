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
    async isNameAvailable(nickname) {
        return new Promise(async (resolve, reject) => {
            try {
                pool.getConnection(async (error, connection) => {
                    if (error) {
                        connection.release();
                        return resolve({
                            status: false,
                            result: null,
                            message: error,
                        });
                    }

                    connection.query("SELECT nickname FROM `character` WHERE nickname = ?", [nickname.trim()],
                        async (error, rows) => {

                            if (error) {
                                connection.release();
                                return resolve({
                                    status: false,
                                    result: null,
                                    message: error.message,
                                });
                            }
                            if (rows?.length <= 0) {
                                connection.release();
                                return resolve({
                                    status: true,
                                    result:null,
                                    message: 'You can use this nickname'
                                });
                            } else {
                                connection.release();
                                return resolve({
                                    status: false,
                                    result:null,
                                    message: 'Nickname already taken'
                                });
                            }
                            
                        });
                });
            } catch (err) {
                connection.release();
                resolve({
                    status: false,
                    result: null,
                    message: err.message,
                });
            }
        });
    },
};

module.exports = { ...methods };
