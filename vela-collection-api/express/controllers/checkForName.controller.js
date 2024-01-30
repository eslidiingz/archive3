const config = require("../configs/app");
const { verifyAuthorization } = require("../helpers");
const Service = require("../services/checkForName.service")

const methods = {
  async checkForName(req, res) {

    const result = await Service.isNameAvailable(req.query.nickname);

    res.json(result)
  }
};

module.exports = { ...methods };
