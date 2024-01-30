const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    address: {
      type: String,
      index: true,
      required: true,
    },
    roles: {
      type: String,
    },
    flag: {
      type: String,
      required: true,
    },
    register: {
      type: Object,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("whitelistUser", {
  ref: "Users",
  localField: "address",
  foreignField: "address",
  justOne: true
});

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    address: this.address,
    roles: this.roles,
    register: this.register,
    flag: this.flag,
    whitelistUser: this.whitelistUser,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Whitelists", schema);
