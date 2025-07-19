const express = require("express");
const connectDB = require("./config/database");
// const User = require("./models/user")
const User = require("./models/user")
const bcrypt = require("bcrypt")
const validator = require("validator")

const { adminAuth, userAuth } = require("./middlewares/auth");
const { validatingSignup } = require("./utils/validation");
const cookies = require("cookies");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const app = express();
app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  try {
    // validating the daata
    validatingSignup(req);

    const {firstName, lastName, emailId, password} = req.body;

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);


    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: passwordHash
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
      message: "Error in signup" + error.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const {emailId, password} = req.body;
    if(!emailId || !password) {
      throw new Error(": All fields are mandatory")
    }
    
    if(!validator.isEmail(emailId)){
      // console.log('hello');
      throw new Error(": Not a valid email")
    }

    const user = await User.findOne({emailId: emailId});
    if(!user) {
      throw new Error("Invalid Credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){

      // create jwt
      const token = await jwt.sign({_id: user._id}, "Dev@Tinder8689");
      console.log(token);
      // send in cookie
      res.cookie("token", token);

      res.send("Login successfull")
    }else{
      throw new Error(": Password is not correct")
    }

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in login" + error.message
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
      message: "Error in getting user" + error.message
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
      message: "Error in getting user" + error.message
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
      message: "Error in getting user" + error.message
    });
  }
}) 

app.get("/profile", async (req, res) => {
  try {

    const cookies = req.cookies;
    const {token} = cookies;
    if(!token) {
      throw new Error("Invalid Token")
    }

    const decodedMessage = await jwt.verify(token, "Dev@Tinder8689");
    const {_id} = decodedMessage;

    const userDetails = await User.findById(_id);
    if(!userDetails) {
      throw new Error("Login again")
    }

    // console.log('token in profile', token);
    res.send(userDetails); 


  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in signup" + error.message
    });
  }
})

app.patch("/user/:userId", async (req, res)=>{
  try {
    const userId = req.params?.userId;
    const data = req.body;

    // console.log('userID: ', userId);

    const ALLOWEDUPDATES = ["userId", "skills", "age", "about", "photoUrl"];

    const isAllowed = Object.keys(data).every((k)=>ALLOWEDUPDATES.includes(k))

    
    if(!isAllowed){
      console.log('hello');
      throw new Error(": Updates not allowed")
    }

    if(data?.skills.length > 10){
      throw new Error(": Skills cannot be more than 10")
    }

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
