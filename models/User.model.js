const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: String,
    name: String,
    age: Number,
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("flmuser", userSchema);

module.exports = {
  UserModel,
};
