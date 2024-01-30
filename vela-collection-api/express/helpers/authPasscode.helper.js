const jwt = require("jsonwebtoken");
const config = require("../configs/app");

const methods = {
  verifyPasscodeToken(req) {
    try {
      if (req?.headers?.["passcode-authorization"]) {
        return jwt.verify(req.headers["passcode-authorization"], config.secret);
      }
      return null;
    } catch {
      return null;
    }
  },
  verifyAuthorization(req) {
    try {
      if (req?.headers?.["authorization"]) return jwt.verify(req.headers["authorization"], config.signinSecret);
      
      return null;
    } catch (e){
      return null;
    }
  },
};

module.exports = { ...methods };
