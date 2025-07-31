const express = require("express");
const connectDB = require("./config/database");
const cookies = require("cookies");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
