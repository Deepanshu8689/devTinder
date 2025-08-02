const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {
    timestamps: true
})

connectionRequestSchema.index({fromUserID: 1, toUserID: 1})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);