const mongoose = require("mongoose");

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
    },
    password : {
        type: String,
        required: true,
        unique: true,
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
        default: "https://avatar.iran.liara.run/public/7"
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