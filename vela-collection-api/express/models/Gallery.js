const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    user: {
      type: String,
      index: true,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function (invisible = null) {
  return {
    user: this.user,
    images: this.images,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Galleries", schema);
