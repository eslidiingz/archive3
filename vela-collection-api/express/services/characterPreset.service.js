// const { ErrorNotFound } = require("../configs/errorMethods");
const pool = require("../configs/databases").mysql();

const methods = {
    findByUser(walletAddress) {
        return new Promise(async (resolve, reject) => {
            try {
                pool.getConnection(async (err, connection) => {
                    if (err) {
                        connection.release();
                        return resolve({
                            status: false,
                            result: null,
                            message: "Failed to get character preset.",
                        });
                    }

                    connection.query(
                        "SELECT id FROM `character` WHERE `owner` = ?",
                        [walletAddress],
                        async (error, rows) => {
                            if (error) {
                                connection.release();
                                return resolve({
                                    status: false,
                                    result: null,
                                    message: "Failed to get character preset.",
                                });
                            }

                            if (rows?.length) {
                                const account = rows[0];

                                connection.query(
                                    "SELECT preset_name,model_id,skin_tone,head,body,feet,accessories,status FROM `character_presets` WHERE `character_id` = ?",
                                    [account.id],
                                    async (error, rows) => {
                                        if (error) {
                                            connection.release();
                                            return resolve({
                                                status: false,
                                                result: null,
                                                message: "Failed to get character preset.",
                                            });
                                        }

                                        connection.release();
                                        return resolve({
                                            status: true,
                                            result: { characterPresets: rows }
                                        });
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
                    message: "Failed to get character preset.",
                });
            }
        });
    }
};

module.exports = { ...methods };
