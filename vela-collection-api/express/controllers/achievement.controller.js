const config = require("../configs/app");
const { verifyAuthorization } = require("../helpers");
const Service = require("../services/achievement.service")

const methods = {
  async getFirstTimeLogin(req, res) {
    const authHeader = verifyAuthorization(req);
    
    if (!authHeader?.sender) {
      return res.success({
        status: false,
        result: false,
      });
    }

    const result = await Service.getFirstTimeLogin(authHeader.sender);

    res.json(result)
  }
};

module.exports = { ...methods };
