const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://deepanshusaini80592:FONRzMtX0PRXZfq2@cluster0.neqkx0l.mongodb.net/devTinder")
}

module.exports = connectDB;