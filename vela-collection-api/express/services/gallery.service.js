const Gallery = require("../models/Gallery");
const url = require("url");
const { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  findUploadedImageByUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const galleries = await Gallery.find({ user });
        resolve(galleries);
      } catch (error) {
        reject(ErrorNotFound(error.message));
      }
    });
  },
  insertImage({ user = null, fileUrl = null, uploadedAt = new Date() }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user || !fileUrl) {
          reject(ErrorNotFound("User and filename is required"));
        }

        const images = { fileUrl, uploadedAt };

        const gallery = await Gallery.findOneAndUpdate({ user }, { $push: { images } }, { upsert: true, new: true });

        return resolve(gallery);
      } catch (error) {
        reject(ErrorNotFound(error.message));
      }
    });
  },
};

module.exports = { ...methods };
