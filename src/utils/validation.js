const validator = require("validator")

const validatingSignup = (req) => {
    const {firstName, lastName, password, emailId} = req.body;

    if(!firstName || !lastName || !emailId || !password){
        throw new Error(": All fields are mandatory")
    }

    if(firstName.length < 4 || firstName.length > 50){
        throw new Error(": Length of firstName should be 4-50 characters")
    } 
    if(lastName.length < 3 || lastName.length > 50){
        throw new Error(": Length of lastName should be 4-50 characters")
    } 

    if(!validator.isEmail(emailId)){
        throw new Error(": Email is not valid")
    }

    if(!validator.isStrongPassword(password)){
        throw new Error(": Password is weak")
    }
}

module.exports = {
    validatingSignup,
}