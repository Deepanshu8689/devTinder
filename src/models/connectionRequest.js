const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId
    },
    toUserID: {
        type: mongoose.Schema.Types.ObjectId
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