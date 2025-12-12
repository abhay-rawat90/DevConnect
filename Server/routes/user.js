const express = require("express");
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

router.get("/connections", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('connections', 'username email profilePicture');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/profile", protect, getMyProfile);

router.get("/profile/:userId", protect, async (req, res) => {
    try{
        const user = await User.findById(req.params.userId).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch(err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({message: "User not found"});
        }
        console.log(err);
        res.status.json({message: "Server Error"});
    }
})

module.exports = router;