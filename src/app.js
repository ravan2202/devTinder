const express = require("express");
const connectDB = require("./config/database");
const User  = require("./models/user");
const app = express();
const{validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");


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

            const token = await jwt.sign({_id : user._id},"Learning@Backend#2202",{
                expiresIn : "1d", // token expires...
            });
            res.cookie("token" ,token, {
                expires: new Date(Date.now() + 7 * 3600000), // cookie expires...
            });

            res.send("Login Successful !!!");
        }
        else{
            res.send("Invalid Credentials");
        }


    } catch (error) {
        res.status(400).send("ERROR : " + error);
    }
});

app.get("/profile", userAuth , async (req,res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
   
});

app.post("/sendConnectionRequest" , userAuth, async (req,res) => {
    try {
        const user = req.user;
        res.send(user.firstName + " is sending you friend request");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})


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



connectDB()
.then(()=>{
    console.log("Database connected !!!");

    app.listen(3000,() => {
        console.log("Server is running on port 3000...")
    });
    
})
.catch(err => {
    console.log("Database not connected !!!",err.message);
});



