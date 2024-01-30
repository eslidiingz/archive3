const { verifyPasscodeToken } = require("../helpers/index");
const Service = require("../services/vipcharacter.service");

const methods = {
  async onGetVipCharacterByPasscode(req, res) {
    try {
      const decoded = verifyPasscodeToken(req);

      if (!decoded?.sender) {
        return res.error({ message: "Unauthorized", status: 401 });
      }

      const passcode = decoded.sender.slice(-8);

      const result = await Service.findByPasscode(passcode || null);

      return res.success({
        status: true,
        result,
      });
    } catch (error) {
      res.error(error);
    }
  },
  async onInsert(req, res) {
    try {
      const decoded = verifyPasscodeToken(req);

      if (!decoded?.sender) {
        return res.error({ message: "Unauthorized", status: 401 });
      }

      const passcode = decoded.sender.slice(-8);

      const { characterType, nickname, modelPrefab = null } = req.body;

      const data = {
        passcode,
        characterType,
        nickname,
        modelPrefab,
      };
      const result = await Service.insert(data);

      res.success({ status: true, result });
    } catch (error) {
      res.error(error);
    }
  },
  async onClearModelPrefabAndNickname(req, res) {
    try {
      const result = await Service.clearModelPrefabAndNickname();

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async onDeleteAll(req, res) {
    try {
      const result = await Service.deleteAll();

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
