const Service = require("../services/passcode.service");

const methods = {
  async onGetByPasscode(req, res) {
    try {
      const result = await Service.findByPasscode(req.body?.passcode || "");

      res.success({
        status: true,
        result,
      });
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
