const multer = require("multer");
const fs = require("fs");
const config = require("../configs/app");
const { verifyAuthorization } = require("../helpers/index");
const Service = require("../services/gallery.service");
const { diskStorage, fileFilter } = require("../helpers/fileSystem.helper");

const uploadImage = multer({ storage: diskStorage("public", "/uploads/gallery"), fileFilter: fileFilter() }).single("image");

const GALLERY_FILE_PATH = "public/uploads/gallery";

const methods = {
  async onGetUploadedImage(req, res) {
    try {
      const authHeader = verifyAuthorization(req);

      if (!authHeader?.sender) {
        return res.success({
          status: false,
          result: false,
        });
      }

      const result = await Service.findUploadedImageByUser(authHeader.sender);

      res.success({
        status: true,
        result,
      });
    } catch (error) {
      res.error(error);
    }
  },
  async onUploadImage(req, res) {
    try {
      uploadImage(req, res, async function (err) {
        const authHeader = verifyAuthorization(req);

        if (!authHeader?.sender) {
          return res.success({
            status: false,
            result: false,
          });
        }

        const file = req.file;

        if (!file) {
          return res.success({
            status: false,
            result: false,
          });
        }

        if (err) {
          return res.success({
            status: false,
            result: false,
          });
        }

        const fileUrl = `${config.appUrl}/api/v1/galleries/uploaded/${file.filename}`;

        const result = await Service.insertImage({ user: authHeader.sender, fileUrl, uploadedAt: new Date() });

        return res.success({
          status: true,
          result: true,
        });
      });
    } catch (error) {
      res.error(error);
    }
  },
  async onGetGalleryFile(req, res) {
    try {
      const filename = req.params.filename;
      if (filename) {
        if (fs.existsSync(`${GALLERY_FILE_PATH}/${filename}`)) {
          return res.sendFile(filename, { root: GALLERY_FILE_PATH });
        }
      }
      return res.sendFile();
    } catch {
      return res.sendFile();
    }
  },
};

module.exports = { ...methods };
