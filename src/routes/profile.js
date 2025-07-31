const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // console.log('token in profile', token);
    const userDetails = req.user;
    res.send(userDetails);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in signup" + error.message,
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
    throw new Error("Edit not allowed");
  }

  const loggedUser = req.user;
  // console.log(loggedUser);

  Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
  await loggedUser.save();

  // console.log(loggedUser);

  res.json({
    message: `${loggedUser.firstName} , your profile has been updated successfully`,
    data: loggedUser,
  });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in updating profile: " + error.message,
    });
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("All fields are required");
    }

    const loggedUser = req.user;
    const comparePass = await bcrypt.compare(
      currentPassword,
      loggedUser.password
    );

    if (!comparePass) {
      throw new Error("Invalid credentials");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New Password and confirm Password must be same");
    }

    if(!validator.isStrongPassword(newPassword)){
      throw new Error("Password is weak");
    }

    const hassedPass = await bcrypt.hash(newPassword, 10);
    loggedUser.password = hassedPass;

    await loggedUser.save();

    res.send("updated succesfully");
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in updating password: " + error.message,
    });
  }
});

module.exports = profileRouter;
