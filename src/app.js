const express = require("express");
const connectDB = require("./config/database");
const User  = require("./models/user");
const app = express();

app.use(express.json())

app.post("/signup", async (req,res) =>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User Added Succesfully");
    }
    catch(err){
        res.status(400).send("Error Adding User" + err.message)
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
        res.status(400).send("Something went wrong" + error);
    }
});

app.get("/feed", async (req,res) => {
    try {
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

app.patch("/user", async(req,res) => {

    const userId = req.body.userId;
    const data = req.body;

    try {
        const dataa = await User.findByIdAndUpdate(userId,data,{returnDocument:"after"});//{returnDocument:"after"} will return doc before/after update.
        res.send("User is updated successfully");
    } catch (error) {
        res.status(404).send("Something went wrong" + error);
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



