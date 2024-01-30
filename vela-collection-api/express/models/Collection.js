const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator");

const transactionSchema = new mongoose.Schema({
  item: {
    type: String,
  },
  token: {
    type: String,
  },
  user: {
    type: String,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    cover: {
      type: String,
    },
    owner: {
      type: String,
    },
    assets: {
      type: Array,
      default: [],
    },
    holder: {
      type: Array,
      default: [],
    },
    transaction: [transactionSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("userAssets", {
  ref: "Assets",
  localField: "assets",
  foreignField: "_id",
  count: true,
  match: (collection) => ({ _id: { $in: collection.assets } }),
});

schema.virtual("user", {
  ref: "Users",
  localField: "owner",
  foreignField: "_id",
  justOne: true
});

// Apply the uniqueValidator plugin to userSchema.
schema.plugin(uniqueValidator);

schema.method.toJSON = function () {
  return {
    title: this.title,
    description: this.description,
    cover: this.cover,
    owner: this.owner,
    assets: this.assets,
    holder: this.holder,
    transaction: this.transaction,
    userAssets: this.userAssets,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Custom field before save
schema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("CollectionAssets", schema);
