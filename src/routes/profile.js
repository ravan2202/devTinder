const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const{validateEditProfileData} = require("../utils/validation")

profileRouter.get("/profile/view", userAuth , async (req,res) => {
    try {
        const user = req.user;
        // res.send(user);
        res.json({
            data : user
        })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
   
});


profileRouter.patch("/profile/edit", userAuth , async (req,res) => {
    try {
        validateEditProfileData(req);
        if(!validateEditProfileData){
            throw new Error ("Invalid request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({
            message : `${loggedInUser.firstName} , your profile is updated successfuly`,
            data : loggedInUser
        })
            
        
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = profileRouter;