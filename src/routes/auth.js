const express = require("express");
const authRouter = express.Router();
const{validateSignUpData} = require("../utils/validation")
const User  = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req,res) =>{
 
    try{
        validateSignUpData(req);

        const {firstName, lastName, emailID, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailID,
            password:passwordHash,

        })
        await user.save();
        res.send("User Added Succesfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    } 
});

authRouter.post("/login", async(req,res) =>{
    try {
        const{emailID,password} = req.body;

        const user = await User.findOne({emailID : emailID})
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password); //schema-method

        if(isPasswordValid){

            const token = await user.getJWT() ; // shema-method

            res.cookie("token" ,token, {
                expires: new Date(Date.now() + 7 * 3600000), // cookie expires...
            });

            res.send("Login Successfull !!!");
        }
        else{
            res.send("Invalid Credentials");
        }


    } catch (error) {
        res.status(400).send("ERROR : " + error);
    }
});

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null , {
        expires : new Date(Date.now()),
    })
    res.send("Logout Successfull");
});

module.exports = authRouter