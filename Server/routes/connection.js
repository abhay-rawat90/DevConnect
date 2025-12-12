const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const Connection = require('../models/Connections');
const User = require('../models/User');


router.post("/send",protect, async(req,res) => {
    const{ recipientId } = req.body;
    const requesterId = req.user._id;

    if(recipientId == requesterId)
    {
        return res.status(400).json({message: "You cannot connect with yourself"});
    }

    try {
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already sent or you are already connected." });
    }

    const newConnection = new Connection({
      requester: requesterId,
      recipient: recipientId,
    });

    await newConnection.save();
    res.status(201).json({ message: "Connection request sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Accept a connection request
router.put("/accept", protect, async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user._id;

  try {
    const request = await Connection.findById(requestId);

    if (!request || request.recipient.toString() !== userId) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: "This request has already been actioned." });
    }

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(userId, { $push: { connections: request.requester } });
    await User.findByIdAndUpdate(request.requester, { $push: { connections: userId } });

    res.json({ message: "Connection request accepted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get pending connection requests
router.get("/requests", protect, async (req, res) => {
  try {
    const requests = await Connection.find({ recipient: req.user._id, status: 'pending' }).populate('requester', 'username');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/reject", protect, async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user._id;

  try {
    const request = await Connection.findById(requestId);

    // Ensure the request exists and is for the current user
    if (!request || request.recipient.toString() !== userId) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (request.status !== 'pending') {
        return res.status(400).json({ message: "This request has already been actioned." });
    }

    // Update status to 'rejected'
    request.status = 'rejected';
    await request.save();

    res.json({ message: "Connection request rejected." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

