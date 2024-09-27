const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
    },
    emailID : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address...")
            }
        }
    },
    password : {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password.    " )
            }
        }
    },
    age : {
        type: Number,
        min: 18,
    },
    gender : {
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error ("Gender data is not valid")
            }
        },
    },
    photoURL : {
        type: String,
        default: "https://avatar.iran.liara.run/public/7",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL...    " + value)
            }
        }
    },
    about : {
        type: String,
        default: "This is a default about of the user !",
        maxLength:500,
    },
    skills : {
        type: [String],
    }
},
{
    timestamps:true,
}
);

const User = mongoose.model("User", userSchema);

module.exports = User;