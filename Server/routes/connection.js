const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const protect = require('../middlewares/auth');
const Connection = require('../models/Connections');
const User = require('../models/User');


router.post("/send",protect, async(req,res) => {
    const{ recipientId } = req.body || {};
    const requesterId = req.user._id;

    if(!mongoose.isValidObjectId(recipientId))
    {
        return res.status(400).json({message: "Invalid user id"});
    }

    if(recipientId == requesterId)
    {
        return res.status(400).json({message: "You cannot connect with yourself"});
    }

    try {
    const recipientExists = await User.exists({ _id: recipientId });
    if (!recipientExists) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === 'accepted') {
        return res.status(400).json({ message: "You are already connected." });
      }
      if (existingConnection.status === 'pending') {
        const sentByMe = existingConnection.requester.toString() === requesterId;
        return res.status(400).json({
          message: sentByMe
            ? "Connection request already sent."
            : "This user has already sent you a request. Check your Requests page.",
        });
      }
      // A declined request can be sent again (by either person): reuse the record as a fresh request
      existingConnection.requester = requesterId;
      existingConnection.recipient = recipientId;
      existingConnection.status = 'pending';
      await existingConnection.save();
      return res.status(201).json({ message: "Connection request sent." });
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
  const { requestId } = req.body || {};
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(404).json({ message: "Connection request not found." });
  }

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

    await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.requester } });
    await User.findByIdAndUpdate(request.requester, { $addToSet: { connections: userId } });

    res.json({ message: "Connection request accepted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get pending connection requests
router.get("/requests", protect, async (req, res) => {
  try {
    const requests = await Connection.find({ recipient: req.user._id, status: 'pending' }).populate('requester', 'name username profilePicture');
    // Skip requests whose sender no longer exists
    res.json(requests.filter(r => r.requester));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/reject", protect, async (req, res) => {
  const { requestId } = req.body || {};
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(404).json({ message: "Connection request not found." });
  }

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

