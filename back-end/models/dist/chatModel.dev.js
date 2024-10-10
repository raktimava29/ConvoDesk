"use strict";

var mongoose = require("mongoose");

var chatModel = mongoose.Schema({
  chatName: {
    type: String,
    trim: true
  },
  isGroupChat: {
    type: Boolean,
    "default": false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});
var Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;