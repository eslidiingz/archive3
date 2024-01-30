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
    async getFirstTimeLogin(walletAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                pool.getConnection(async (err, connection) => {
                    if (err) {
                        connection.release();
                        return resolve({
                            status: false,
                            result: null,
                            message: error.message,
                        });
                    }

                    connection.query("SELECT id FROM `character` WHERE owner = ?", [walletAddress],
                        async (error, rows) => {

                            if (error) {
                                connection.release();
                                return resolve({
                                    status: false,
                                    result: null,
                                    message: error.message,
                                });
                            }

                            const characterId = rows[0]?.id;

                            connection.query(
                                "SELECT * FROM player_achievements pa WHERE pa.character_id = ? AND pa.achievement_name = ? ORDER BY pa.id ASC LIMIT 1",
                                [characterId, 'First-Login'],
                                async (error, rows) => {

                                    const result = {
                                        firstTimeLogin: rows?.[0]?.achievement_name == 'First-Login' ? false : true
                                    }

                                    if (error) {
                                        connection.release();
                                        return resolve({
                                            status: false,
                                            result: null,
                                            message: error.message,
                                        });
                                    }


                                    if (rows?.length <= 0) {
                                        connection.query(
                                            "INSERT INTO player_achievements (character_id,achievement_name,`status`) VALUES(?,?,?)",
                                            [characterId, 'First-Login', 1],
                                            async (error) => {
                                                if (error) {
                                                    connection.release();
                                                    return resolve({
                                                        status: false,
                                                        result: null,
                                                        message: error,
                                                    });
                                                }

                                                connection.release();
                                                return resolve({
                                                    status: true,
                                                    result
                                                });
                                            });
                                    } else {
                                        connection.release();
                                        return resolve({
                                            status: true,
                                            result
                                        });
                                    }
                                })
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
