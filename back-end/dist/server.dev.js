"use strict";

var express = require("express");

var dotenv = require("dotenv");

var connectDB = require("./config/dbase");

var userRoute = require('./routers/user-route');

var chatRoute = require('./routers/chat-route');

var messageRoute = require('./routers/message-route');

var _require = require("./error-handling/error-handler"),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler;

dotenv.config();
connectDB();
var app = express();
app.use(express.json());
app.get("/", function (req, res) {
  res.send("Api is running");
});
app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/msg', messageRoute);
app.use(notFound);
app.use(errorHandler);
var PORT = process.env.PORT || 5000;
var server = app.listen(PORT, console.log("Server Started"));

var io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173"
  }
});

io.on("connection", function (socket) {
  socket.on("setup", function (userData) {
    socket.join(userData._id);
    socket.emit("connection");
  });
  socket.on("Join", function (room) {
    socket.join(room);
    console.log("User Joined " + room);
  });
  socket.on("Typing", function (room) {
    return socket["in"](room).emit("Typing");
  });
  socket.on("NotTyping", function (room) {
    return socket["in"](room).emit("NotTyping");
  });
  socket.on("Recieved", function (messageRecieved) {
    var chat = messageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(function (user) {
      if (user._id == messageRecieved.sender._id) return;
      socket["in"](user._id).emit("Message Recieved", messageRecieved);
    });
  });
  socket.off("setup", function () {
    console.log("User Disconnected");
    socket.leave(useData._id);
  });
});