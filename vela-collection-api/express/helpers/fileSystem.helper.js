const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const { storages, whitelist } = require("../configs/fileSystem");

const diskStorage = (storageName = "public", uploadPath = "") => {
  const storagePath = `${storages?.[storageName]?.path}${uploadPath}` || `${path.dirname(require.main.filename)}/public`;

  return multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, storagePath);
    },
    filename: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      callback(null, `${uuidv4()}_${Date.now()}${ext}`);
    },
  });
};

const fileFilter = (acceptExtension = whitelist) => {
  return (req, file, cb) => {
    try {
      if (!acceptExtension.includes(file.mimetype)) return cb(new Error("File is not allowed"));
      cb(null, true);
    } catch {
      cb(new Error("File is not allowed"));
    }
  };
};

module.exports = { diskStorage, fileFilter };
