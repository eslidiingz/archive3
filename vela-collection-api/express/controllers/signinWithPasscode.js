const Service = require("../services/signinWithPasscode.service");

const methods = {
  async onSignInByPasscode(req, res) {
    try {
      const result = await Service.findByPasscode(req.body?.passcode || "");

      res.success({
        status: result?.token ? true : false,
        result,
      });
    } catch (error) {
      res.success({
        status: false,
        result: null,
      });
    }
  },
};

module.exports = { ...methods };
