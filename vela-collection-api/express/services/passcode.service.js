const Passcode = require("../models/Passcode"),
  { ErrorNotFound } = require("../configs/errorMethods");

const jwt = require("jsonwebtoken"),
  secret = require("../configs/app").secret;

const methods = {
  generateJwtFromPasscode(passcode) {
    return jwt.sign({ passcode }, secret);
  },
  findByPasscode(passcode) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Passcode.findOne({ passcode });
        if (!obj?.passcode) {
          reject(ErrorNotFound(`Passcode ${passcode} not found`));
        }
        const passcodeObject = obj.toJSON();
        const token = this.generateJwtFromPasscode(passcodeObject.passcode);
        resolve({ token });
      } catch (error) {
        reject(ErrorNotFound(error.message));
      }
    });
  },
};

module.exports = { ...methods };
