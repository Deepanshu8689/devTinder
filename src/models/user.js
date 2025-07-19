const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your Password is weak")
            }
        }
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
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL")
            }
        }
    },
    skills: {
        type: [String],
    }
}, {

    timestamps: true

})

module.exports = mongoose.model("User", userSchema);