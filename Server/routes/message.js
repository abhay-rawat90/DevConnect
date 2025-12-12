const express = require('express');
const router = express.Router();
const protect = require("../middlewares/auth");
const Message = require("../models/Message");


router.get("/:recipientId", protect, async (req,res) => {
    try{
        const messages = await Message.find({
            $or: [
                {sender: req.user._id, recipient: req.params.recipientId },
                {sender: req.params.recipientId, recipient: req.user._id},
            ],
        }).sort({createdAt: 'asc'});

        res.json(messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Server Error"});
    }
});

router.post("/", protect, async(req,res) => {
    const {recipient, content} = req.body;
    try{
        const newMessage = new Message({
            sender: req.user._id,
            recipient,
            content
        });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch(err) {
        res.status(500).json({message: "Server Error"});
    }
});


module.exports = router;
