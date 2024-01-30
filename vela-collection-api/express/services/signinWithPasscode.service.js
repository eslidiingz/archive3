const Passcode = require("../models/Passcode"),
  { ErrorNotFound } = require("../configs/errorMethods");

const jwt = require("jsonwebtoken"),
  secret = require("../configs/app").secret;

const methods = {
  generateJwtFromPasscode(passcode) {
    if (!passcode) return null;

    return jwt.sign({ sender: passcode }, secret, { expiresIn: "24hr" });
  },
  findByPasscode(passcode) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Passcode.findOne({ passcode });

        // if (!obj?.passcode) {
        //   reject(ErrorNotFound(`Passcode ${passcode} was not found`));
        // }

        if (obj?.toJSON()?.passcode) {
          let passcode = obj.toJSON().passcode;
          let diffLength = 42 - passcode.length;
          passcode = "0".repeat(diffLength) + passcode;
          const token = this.generateJwtFromPasscode(passcode);
          resolve({ token });
        } else {
          reject(ErrorNotFound(error.message));
        }
      } catch (error) {
        reject(ErrorNotFound(error.message));
      }
    });
  },
};

module.exports = { ...methods };
