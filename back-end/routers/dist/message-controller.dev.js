"use strict";

var asyncHandler = require("express-async-handler");

var Message = require("../models/messageModel");

var User = require("../models/userModel");

var Chat = require("../models/chatModel");

var sendMessage = asyncHandler(function _callee(req, res) {
  var _req$body, content, chatId, newMessage, message;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, content = _req$body.content, chatId = _req$body.chatId;

          if (!(!content || !chatId)) {
            _context.next = 4;
            break;
          }

          console.log("Invalid data passed into request");
          return _context.abrupt("return", res.sendStatus(400));

        case 4:
          newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
          };
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(Message.create(newMessage));

        case 8:
          message = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(message.populate("sender", "name"));

        case 11:
          message = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(message.populate("chat"));

        case 14:
          message = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(User.populate(message, {
            path: "chat.users",
            select: "name email"
          }));

        case 17:
          message = _context.sent;
          _context.next = 20;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: message
          }));

        case 20:
          res.json(message);
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](5);
          res.status(400);
          throw new Error(_context.t0.message);

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 23]]);
});
var allMessages = asyncHandler(function _callee2(req, res) {
  var messages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Message.find({
            chat: req.params.chatId
          }).populate("sender", "name email").populate("chat"));

        case 3:
          messages = _context2.sent;
          res.json(messages);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(400);
          throw new Error(_context2.t0.message);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = {
  allMessages: allMessages,
  sendMessage: sendMessage
};