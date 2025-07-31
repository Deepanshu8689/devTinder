const express = require("express");
const authRouter = express.Router();
const { validatingSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    // validating the daata
    validatingSignup(req);

    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    console.log("user", user);

    return res.json({
      success: true,
      message: "User signed up successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in signup" + error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error(": All fields are mandatory");
    }

    if (!validator.isEmail(emailId)) {
      // console.log('hello');
      throw new Error(": Not a valid email");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // create jwt
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder8689", {
        expiresIn: "1d",
      });
      console.log(token);
      // send in cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 12 * 3600000), // cookie will be removed after 12 hours
      });

      res.send("Login successfull");
    } else {
      throw new Error(": Password is not correct");
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in login" + error.message,
    });
  }
});

authRouter.post("/logout", async(req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  })
  res.send("logout successfull");
})

module.exports = authRouter;