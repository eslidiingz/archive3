const Service = require("../services/register.service");

const methods = {
  async onRegister(req, res) {
    try {
      const { validated, errorMessages = [] } = await Service.validateRegisterReqBody(req.body);

      if (!validated) {
        return res.success({
          status: false,
          result: null,
          message: errorMessages,
        });
      }

      const reqBody = req.body;

      const result = await Service.insertOrUpdate({
        walletAddress: reqBody.walletAddress,
        username: reqBody.username,
        password: reqBody.password,
        email: reqBody.email,
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
