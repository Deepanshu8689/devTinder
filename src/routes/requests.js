const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params.toUserId;
      const status = req.params.status;

      if (fromUserID.equals(toUserID)) {
        return res.status(400).json({
          message: "Cannot send request to yourself",
        });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      const toUser = await User.findById(toUserID);
      const fromUser = await User.findById(fromUserID);

      if (!toUser) {
        return res.status(400).json({
          message: "User doesnot exist!!",
        });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exists!!",
        });
      }

      const connectionRequest = await ConnectionRequest.create({
        fromUserID,
        toUserID,
        status,
      });

      res.json({
        message: `${fromUser.firstName} is ${status} in ${toUser.firstName}`,
        connectionRequest,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error in sending request",
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestID } = req.params;

      const allowedStatus = ["accepted", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserID: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection Request Not Found",
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data,
      });
    } catch (error) {
      return res.status(400).send("Error: "+ error.message);
    }
  }
);

module.exports = requestRouter;
