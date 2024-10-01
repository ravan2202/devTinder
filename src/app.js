const express = require("express");
const connectDB = require("./config/database");
const User  = require("./models/user");
const app = express();
const{validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) =>{
 
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

app.post("/login", async(req,res) =>{
    try {
        const{emailID,password} = req.body;

        const user = await User.findOne({emailID : emailID})
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if(isPasswordValid){

            const token = await jwt.sign({_id : user._id},"Learning@Backend#2202");
            res.cookie("token" ,token);

            res.send("Login Successful !!!");
        }
        else{
            res.send("Invalid Credentials");
        }


    } catch (error) {
        res.status(400).send("ERROR : " + error);
    }
});

app.get("/profile", async (req,res) => {
    try {
        const cookies = req.cookies;
        const {token} = cookies;

        if(!token){
            throw new Error("Invalid token");
        }

        const decodedMessage = await jwt.verify(token,"Learning@Backend#2202");
        const {_id} = decodedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
   
});

app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;
    
    try {
        const users = await User.find({emailID : userEmail});
        if(users.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error);
    }
});

app.get("/feed", async (req,res) => {
    try {
        console.log("Fetching users...");
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong" + error);
    }
});

app.delete("/user", async(req,res) => {

    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User is removed successfully");
    } catch (error) {
        res.status(404).send("Something went wrong" + error);
    }

});

app.patch("/user/:userId", async(req,res) => {

    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "photoURL",
            "about",
            "skills",
            "age"
        ];

        const isUpdateAllowed = Object.keys(data).every((k)=>
        ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.skills){
            if(data?.skills.length){
                throw new Error ("You can add upto 10 skills only")
            }
        }
    

        const dataa = await User.findByIdAndUpdate(userId,data,{
            returnDocument:"after",//{returnDocument:"after"} will return doc before/after update.
            runValidators:true,
        });
        res.send("User is updated successfully");
    } catch (error) {
        res.status(404).send("Something went wrong.......  " + error.message);
    }

});


connectDB()
.then(()=>{
    console.log("Database connected !!!");

    app.listen(3000,() => {
        console.log("Server is running on port 3000...")
    });
    
})
.catch(err => {
    console.log("Database not connected !!!",err);
});



