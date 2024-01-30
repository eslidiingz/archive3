const VipCharacter = require("../models/VipCharacter"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  findByPasscode(passcode) {
    return new Promise(async (resolve, reject) => {
      try {
        const vipCharacters = await VipCharacter.findOne({ passcode });
        // if (!Array.isArray(vipCharacters) || !vipCharacters.length) {
        //   reject(ErrorNotFound(`Vip character by ${passcode} was not found`));
        // }
        resolve(vipCharacters);
      } catch (error) {
        reject(ErrorNotFound(error.message));
      }
    });
  },
  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const vipCharacter = await VipCharacter.findOneAndUpdate({ passcode: data.passcode }, data, { upsert: true, new: true });
        return resolve(vipCharacter);
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },
  clearModelPrefabAndNickname() {
    return new Promise(async (resolve, reject) => {
      try {
        await VipCharacter.updateMany({}, { nickname: "", modelPrefab: null });
        return resolve({ status: true, result: true });
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },
  deleteAll() {
    return new Promise(async (resolve, reject) => {
      try {
        await VipCharacter.deleteMany({});
        return resolve({ status: true, result: true });
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },
};

module.exports = { ...methods };
