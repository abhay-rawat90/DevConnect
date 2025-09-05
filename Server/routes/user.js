const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const User  = require("../models/User");
const { getMyProfile } = require("../controllers/userController");

router.put("/update",protect, async(req,res) => {
    const  {name, username} = req.body;
    
    try 
    {
        const existingUser = await User.findOne({ username });
        if(existingUser && existingUser._id.toString() !== req.user) 
        {
            return res.status(400).json({ message: "Username Already Taken"});
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            {name, username},
            {new : true}
        ).select("-password");

        res.json({ user : updatedUser});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message : "Server Error"});
    }
});

router.put("/skills",protect, async (req, res) => {
    const { skills } = req.body;

    try{
        const user  = await User.findByIdAndUpdate(
            req.user,
            { skills },
            {new: true}
        );
        res.json(user);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Failed to Update Skills"});
    }
});

router.get("/search", protect, async (req,res) => {
    const { skill } = req.query;

    if(!skill) return res.status(400).json({message : "Skill is Required"});

    try{
        const users = await User.find({ skills : { $in: [skill]}}).select("-password");
        res.json(users);
    }
    catch(err)
    {
        res.status(500).json({ message: "Search Failed"})
    }
});

router.get("/profile", protect, getMyProfile);

module.exports = router;