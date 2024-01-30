const path = require("path");
const fullPath = path.dirname(require.main.filename);

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const storages = {
  public: {
    path: `${fullPath}/public`,
  },
};

module.exports = { storages, whitelist };
