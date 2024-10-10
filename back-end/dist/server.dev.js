"use strict";

var express = require("express");

var dotenv = require("dotenv");

var connectDB = require("./config/dbase");

var userRoute = require('./routers/user-route');

var chatRoute = require('./routers/chat-route');

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
app.use(notFound);
app.use(errorHandler);
var PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server Started"));