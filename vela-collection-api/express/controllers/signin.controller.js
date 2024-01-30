const Service = require("../services/signin.service");

const methods = {
  async onSignInWithCredential(req, res) {
    try {
      const reqBody = req.body;

      if (!reqBody?.username || !reqBody?.password) {
        return res.success({
          status: false,
          result: null,
          message: "Username and password is required.",
        });
      }

      const result = await Service.findByCredential(reqBody);

      res.success(result);
    } catch (error) {
      console.log('ERROR',err.message);
      res.error(error);
    }
  },
};

module.exports = { ...methods };
