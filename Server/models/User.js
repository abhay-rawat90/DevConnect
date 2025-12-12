 const mongoose = require("mongoose");

 const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email:{type:String, required:true,unique: true},
    password:{type: String, required: true},
    profilePicture: { type: String, default: ""},
    skills:{
      type: [String],
      default: [],
    },
    connections: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    level: {type: Number, default: 1},
    quizStats: {
      wins: {type: Number, default: 0},
      losses: {type: Number, default: 0},
      skillWins: {type: Map, of: Number, default: {}}
    }
 }, {timestamps: true});

 module.exports = mongoose.model("User",UserSchema);