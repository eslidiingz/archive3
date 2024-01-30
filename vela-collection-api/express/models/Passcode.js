const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    passcode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    passcode: this.passcode,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Passcodes", schema);
