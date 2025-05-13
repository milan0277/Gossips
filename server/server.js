const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const http = require('http');
const path = require('path');

// Log the environment variable for debugging
console.log(process.env.APP_CLIENT_URL);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.APP_CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Include credentials if necessary
  }
});

// Database connection
const db = require("./db/db");

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Port setup
const PORT = process.env.PORT || 5000;


// CORS configuration
const corsOptions = {
  origin: process.env.APP_CLIENT_URL,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// Apply CORS middleware to the Express app
app.use(cors(corsOptions));


// Routes
const userRouter = require("./route/userRoute");
const chatRouter = require('./route/chatRoute');



// API routes
app.use("/app", userRouter);
app.use('/app', chatRouter);

// Socket.io connection
const users = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    users.set(userId, socket.id);
  });

  socket.on('message', ({ m, receiverId, senderId }) => {
    const receiverSocketId = users.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("data", { m, senderId });
    }
  });

  socket.on("deletemessage", ({ mId, receiverId }) => {
    let receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("dMessage", mId);
    }
  });

  socket.on('disconnect', () => {
    users.forEach((value, key) => {
      if (value === socket.id) {
        users.delete(key);
      }
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log('Server is running at', PORT);
});