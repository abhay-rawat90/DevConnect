const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register",async (req,res) => {
    try{
        const {name, username, email, password} = req.body;

        if(!name || !username || !email || !password)
        {
            return res.status(400).json({message: "All Fields are Required"});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "Email already Exists"});
        }

        const userNameExist = await User.findOne({ username });
        if(userNameExist)
        {
            return res.status(400).json({message: "Username already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({name, username, email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({message: "User Registered Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Server Error"})
    }
});

router.post("/login",async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({ message:  "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Incorrect Password"});
        }

        const payload = {
            userId: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                skills: user.skills,
                connections: user.connections,
                profilePicture: user.profilePicture
            },
        });
    } 
    catch(err){
        console.log(err);
        req.status(500).json({message: "Server Errror"});
    }
});


const protect = require("../middlewares/auth");

router.get('/me', protect, async(req,res) => {
    const user = await User.findOne(req.user).select("-password");
    res.json(user);
});


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

module.exports = router;
