const mongoose = require("mongoose");
const config = require("../configs/app");

const methods = {
  async onImageById(req, res) {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const _bucketID = await bucket
      .find({ _id: mongoose.Types.ObjectId(req.params.id) })
      .toArray();

    if (_bucketID.length === 0) {
      res.error({
        message: "File not found",
      });
    } else {
      try {
        var downloadStream = bucket.openDownloadStream(
          mongoose.Types.ObjectId(req.params.id)
        );
        downloadStream.pipe(res);
      } catch (error) {
        res.error(error);
      }
    }
  },
};

module.exports = { ...methods };
