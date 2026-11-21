const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const protect = require("../middlewares/auth");
const User  = require("../models/User");
const { getMyProfile } = require("../controllers/userController");
const upload = require("../middlewares/upload");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.post('/upload-picture', protect, upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Upload image to Cloudinary from memory buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "devconnect_profiles" }, // Optional: organize uploads in a folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user's profilePicture field with the secure URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile picture updated successfully', user: updatedUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while uploading image.' });
  }
});

router.put("/update",protect, async(req,res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";

    if(!name || !username)
    {
        return res.status(400).json({ message: "Name and username are required"});
    }

    try
    {
        const existingUser = await User.findOne({ username });
        // Keeping your own username is fine; only someone else's is taken
        if(existingUser && existingUser._id.toString() !== req.user._id)
        {
            return res.status(400).json({ message: "Username Already Taken"});
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {name, username},
            {new : true, runValidators: true}
        ).select("-password");

        if(!updatedUser) return res.status(404).json({ message: "User not found"});

        res.json({ user : updatedUser});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message : "Server Error"});
    }
});

router.put("/skills",protect, async (req, res) => {
    const { skills } = req.body || {};

    if(!Array.isArray(skills) || !skills.every(s => typeof s === "string"))
    {
        return res.status(400).json({message: "Skills must be a list of text values"});
    }

    // Trim, drop blanks and duplicates
    const cleanSkills = [...new Set(skills.map(s => s.trim()).filter(Boolean))];

    try{
        const user  = await User.findByIdAndUpdate(
            req.user._id,
            { skills: cleanSkills },
            {new: true}
        ).select("-password");
        res.json(user);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message : "Failed to Update Skills"});
    }
});

router.get("/search", protect, async (req,res) => {
    const skill = typeof req.query.skill === "string" ? req.query.skill.trim() : "";

    if(!skill) return res.status(400).json({message : "Skill is Required"});

    try{
        // Case-insensitive exact match, so "react" finds "React"
        const pattern = new RegExp(`^${escapeRegex(skill)}$`, "i");
        const users = await User.find({ skills: pattern }).select("-password");
        res.json(users);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message: "Search Failed"})
    }
});

router.get("/connections", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('connections', 'name username email profilePicture');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.connections.filter(Boolean));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/profile", protect, getMyProfile);

router.get("/profile/:userId", protect, async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.userId)) {
        return res.status(404).json({message: "User not found"});
    }
    try{
        const user = await User.findById(req.params.userId).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Server Error"});
    }
})

module.exports = router;
