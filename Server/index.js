const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const connectionRoutes = require('./routes/connection');
const messageRoutes = require('./routes/message');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET","POST"]
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages",messageRoutes);

let onlineUsers = [];

const addUser = (userId, socketId) => {
    !onlineUsers.some(user => user.userId === userId) && 
    onlineUsers.push({userId, socketId});
};

const removeUser = (socketId) => {
    return onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text}) => {
    const user = getUser(receiverId);

    const newMessage = new Message({
    sender: senderId,
    recipient: receiverId,
    content: text,
    });
    await newMessage.save();

    if(user) {
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    }
    });

    socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
});
});






mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    server.listen(process.env.PORT, () => console.log(`Server Running on Port ${process.env.PORT}`));
})
.catch(err => console.log(err));