const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is invalid, Please login again");
    }
    
    const decoded = await jwt.verify(token, "Dev@Tinder8689");
    const {_id} = decoded;
    console.log("token: ", _id);

    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not Found")
    }
    req.user = user;
    next();

  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
