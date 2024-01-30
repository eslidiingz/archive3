const { verifyAuthorization } = require("../helpers");
const Service = require("../services/characterPreset.service");

const methods = {
    async onGetCharacterPresetByUser(req, res) {
        try {
            const authHeader = verifyAuthorization(req);

            if (!authHeader?.sender) {
                return res.success({
                    status: false,
                    result: false,
                    message: 'Unauthorized'
                });
            }

            const result = await Service.findByUser(authHeader.sender);

            res.success(result);
        } catch (error) {
            res.success({
                status: false,
                result: null,
            });
        }
    },
};

module.exports = { ...methods };
