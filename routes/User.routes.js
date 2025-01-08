const express = require("express");
const { UserModel } = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { email, password, name, age } = req.body;
  try {
    bcrypt.hash(password, 5, async function (err, hash) {
      const user = new UserModel({ email, name, age, password: hash });
      await user.save();
      res.status(200).send({ msg: "user has been created" });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          const token = jwt.sign(
            { authorID: user.id, author: user.name },
            "secret"
          );
          res.status(200).send({ msg: "login successful", token: token });
        } else {
          res.status(200).send({ msg: "wrong credentials" });
        }
      });
    } else {
      res.status(200).send({ msg: "wrong credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
