const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middlewares/auth");

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

router.post("/register",async (req,res) => {
    try{
        const {name, username, email, password} = req.body || {};

        if(![name, username, email, password].every(isNonEmptyString))
        {
            return res.status(400).json({message: "All Fields are Required"});
        }
        if(!/^\S+@\S+\.\S+$/.test(email.trim()))
        {
            return res.status(400).json({message: "Please enter a valid email"});
        }
        if(password.length < 6)
        {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        const userExists = await User.findOne({email: cleanEmail});
        if(userExists){
            return res.status(400).json({message: "Email already Exists"});
        }

        const userNameExist = await User.findOne({ username: cleanUsername });
        if(userNameExist)
        {
            return res.status(400).json({message: "Username already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({name: name.trim(), username: cleanUsername, email: cleanEmail, password: hashedPassword});
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
        const {email, password} = req.body || {};

        if(!isNonEmptyString(email) || !isNonEmptyString(password))
        {
            return res.status(400).json({message: "Email and password are required"});
        }

        // Accounts created before emails were lower-cased are still found
        const user = await User.findOne({email: email.trim().toLowerCase()}) || await User.findOne({email: email.trim()});
        if(!user)
        {
            return res.status(400).json({ message:  "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Invalid Credentials"});
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
        res.status(500).json({message: "Server Error"});
    }
});


router.get('/me', protect, async(req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user) return res.status(404).json({message: "User not Found"});
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Server Error"});
    }
});

module.exports = router;
