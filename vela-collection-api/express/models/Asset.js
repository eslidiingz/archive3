const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    address: {
      type: String,
    },
    token: {
      type: String,
    },
    hash: {
      type: String,
      default: "",
    },
    metadata: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    verify: {
      type: String,
      default: "",
    },
    remark: {
      type: String,
      default: "",
    },
    verifyId: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: true
    },
    tags: {
      type: Array,
      default: []
    },
    remark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    address: this.address,
    token: this.token,
    hash: this.hash,
    metadata: this.metadata,
    image: this.image,
    tags: this.tags,
    verify: this.verify,
    remark: this.remark,
    verifyId: this.verifyId,
    visible: this.visible,
    remark: this.remark,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Assets", schema);
