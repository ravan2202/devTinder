const validator = require("validator");


const validateSignUpData = (req) => {

    const {firstName, lastName, emailID, password} = req.body;
  
    if(!firstName || !lastName){
        throw new Error ("Name not valid !    ");
    }
    else if (firstName.length < 3 || firstName.length > 50){
        throw new Error ("First name should be 3-50 characters.   ");
    }
    else if(!validator.isEmail(emailID)){
        throw new Error ("Email ID is not valid.   ");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Password is not Strong.");
    }
};

module.exports = {validateSignUpData}