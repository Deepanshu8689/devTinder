const express = require("express");
const connectDB = require("./config/database");
// const User = require("./models/user")
const User = require("./models/user")

const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log("user", user);

    return res.json({
      success: true,
      message: "User signed up successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in signup",
      error,
    });
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    // console.log('email', userEmail);

    const emailUser = await User.findOne({emailId: userEmail});
    console.log('user', emailUser);

    res.send(emailUser)

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in getting user",
      error,
    });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    // const userEmail = req.body.emailId;
    // console.log('email', userEmail);

    const emailUser = await User.find({});
    console.log('user', emailUser);

    res.send(emailUser)

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in getting user",
      error,
    });
  }
});

app.get("/findById", async(req, res) => {
  try {
    const userEmail = req.body;
    console.log('email', userEmail);

    const emailUser = await User.find({});
    console.log('user', emailUser);

    res.send(emailUser)

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in getting user",
      error,
    });
  }
}) 

app.patch("/user", async (req, res)=>{
  try {
    const userId = req.body.userId;
    const data = req.body;

    const updatedUser = await User.findByIdAndUpdate({_id: userId}, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log(updatedUser);
    res.send("updated successFully")
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in updating user" + error.message,
    });
  }
})

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
