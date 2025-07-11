const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

app.post("/signup", async (req, res) => {
  try {
    const user = await User.create({
      firstName: "Deepanshu",
      lastName: "Saini",
      emailId: "deepanshu@gmail.com",
      password: "deepu@123",
    });

    return res.json({
        success: true,
        message: "User signed up successfully",
        user
    })


  } catch (error) {
    return res.status(400).json({
        success: false,
        message: "Error in signup",
        error
    })
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(3000, () => {
      console.log("port is listening at 3000");
    });
  })
  .catch((error) => {
    console.error("Issue in DB connection");
  });
