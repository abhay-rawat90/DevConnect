
const User = require("../models/User");


const getMyProfile = async (req,res) => {
    
    try{
        console.log("req.user", req.user);
        const user = await User.findById(req.user._id).select("-password");
        if(!user)
        {
            return res.status(404).json({message: "User not Found"});
        }
        res.json(user);
    }

    catch(err){
        console.log(err);
        res.status(500).json({message: "Server Error"});
    }
};

module.exports = {
    getMyProfile,
};