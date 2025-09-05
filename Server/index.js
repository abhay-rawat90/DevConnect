const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const connectionRoutes = require('./routes/connection');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => console.log(`Server Running on Port ${process.env.PORT}`));
})
.catch(err => console.log(err));