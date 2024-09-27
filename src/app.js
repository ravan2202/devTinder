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


connectDB()
.then(()=>{
    console.log("Database connected !!!");

    app.listen(3000,() => {
        console.log("Server is running...")
    });
    
})
.catch(err => {
    console.log("Database not connected !!!",err);
});



