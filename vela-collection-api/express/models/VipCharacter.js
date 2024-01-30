const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    passcode: {
      type: String,
      index: true,
      required: true,
    },
    characterType: {
      type: Number,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    modelPrefab: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function (invisible = null) {
  return {
    passcode: this.passcode,
    characterType: this.characterType,
    nickname: this.nickname,
    modelPrefab: this.modelPrefab,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("VipCharacters", schema);
