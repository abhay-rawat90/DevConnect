const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require("socket.io");


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const connectionRoutes = require('./routes/connection');
const messageRoutes = require('./routes/message');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["https://dev-connect-six-ruddy.vercel.app", "http://localhost:5173"];
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});



app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages",messageRoutes);
app.get('/', (req, res) => {
    res.send('API is working');
});

// Unknown API routes get a JSON 404 instead of Express's HTML page
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Central error handler: bad JSON bodies, upload errors (wrong file type, too large), anything unexpected
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: "Invalid request body" });
    }
    if (err.name === 'MulterError') {
        const message = err.code === 'LIMIT_FILE_SIZE' ? "Image must be 5MB or smaller" : err.message;
        return res.status(400).json({ message });
    }
    if (err.message === 'Not an image! Please upload an image.') {
        return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Server Error" });
});

const User = require('./models/User');

// userId -> number of open sockets (one per browser tab). A user stays "online" while any tab is open.
const onlineCounts = new Map();
const onlineList = () => [...onlineCounts.keys()].map(userId => ({ userId }));

const MAX_MESSAGE_LENGTH = 2000;

// Only logged-in users can open a socket. The user id comes from the verified JWT,
// so nobody can register as, or send messages as, someone else.
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = String(decoded.userId);
        next();
    } catch {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    // Each user gets a private room, so every open tab receives their messages.
    // Registering here (not on a client event) means a reconnect re-registers automatically.
    socket.join(socket.userId);
    onlineCounts.set(socket.userId, (onlineCounts.get(socket.userId) || 0) + 1);
    io.emit("getUsers", onlineList());

    // `ack` tells the sender whether the message was really saved
    socket.on("sendMessage", async (payload, ack) => {
        const reply = typeof ack === "function" ? ack : () => {};
        try {
            const { receiverId, text } = payload || {};
            const content = typeof text === "string" ? text.trim() : "";
            if (!content || !mongoose.isValidObjectId(receiverId)) {
                return reply({ ok: false, error: "Invalid message" });
            }
            if (content.length > MAX_MESSAGE_LENGTH) {
                return reply({ ok: false, error: `Messages can be at most ${MAX_MESSAGE_LENGTH} characters` });
            }

            const newMessage = new Message({
                sender: socket.userId,
                recipient: receiverId,
                content,
            });
            await newMessage.save();

            // Name for the notification comes from the database, not from the client
            const sender = await User.findById(socket.userId).select("name username").lean();

            io.to(receiverId).emit("getMessage", {
                senderId: socket.userId,
                text: content,
                senderName: sender?.name || sender?.username,
                createdAt: newMessage.createdAt,
            });
            reply({ ok: true, message: { sender: socket.userId, content, createdAt: newMessage.createdAt, _id: newMessage._id } });
        } catch (err) {
            // Never let a bad message take the whole server down
            console.error("sendMessage failed:", err.message);
            reply({ ok: false, error: "Message could not be sent" });
        }
    });

    socket.on("disconnect", () => {
        const left = (onlineCounts.get(socket.userId) || 1) - 1;
        if (left > 0) onlineCounts.set(socket.userId, left);
        else onlineCounts.delete(socket.userId);
        io.emit("getUsers", onlineList());
    });
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
});


const PORT = process.env.PORT || 5000;

// Start listening straight away so the host sees the service as up even while the
// database connects (or if it is temporarily unreachable).
server.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection failed:', err.message));
