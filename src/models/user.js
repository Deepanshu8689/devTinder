const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female", "others"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    about: {
        type: String,
        default: "This is description of the user",
    },
    photo: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    skills: {
        type: [String],
    }
}, {

    timestamps: true

})

module.exports = mongoose.model("User", userSchema);