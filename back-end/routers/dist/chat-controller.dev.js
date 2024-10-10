"use strict";

var asyncHandler = require("express-async-handler");

var Chat = require("../models/chatModel");

var User = require("../models/userModel");

var accessChat = asyncHandler(function _callee(req, res) {
  var userId, isChat, chatData, createdChat, FullChat;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.body.userId;

          if (userId) {
            _context.next = 4;
            break;
          }

          console.log("userId not sent with request");
          return _context.abrupt("return", res.sendStatus(400));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Chat.find({
            isGroupChat: false,
            $and: [{
              users: {
                $elemMatch: {
                  $eq: req.user._id
                }
              }
            }, {
              users: {
                $elemMatch: {
                  $eq: userId
                }
              }
            }]
          }).populate("users", "-password").populate("lastMessage"));

        case 6:
          isChat = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(User.populate(isChat, {
            path: "lastMessage.sender",
            select: "name email"
          }));

        case 9:
          isChat = _context.sent;

          if (!(isChat.length > 0)) {
            _context.next = 14;
            break;
          }

          res.send(isChat[0]);
          _context.next = 29;
          break;

        case 14:
          chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
          };
          _context.prev = 15;
          _context.next = 18;
          return regeneratorRuntime.awrap(Chat.create(chatData));

        case 18:
          createdChat = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: createdChat._id
          }).populate("users", "-password"));

        case 21:
          FullChat = _context.sent;
          res.status(200).json(FullChat);
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](15);
          res.status(400);
          throw new Error(_context.t0.message);

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[15, 25]]);
});
var getChats = asyncHandler(function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          Chat.find({
            users: {
              $elemMatch: {
                $eq: req.user._id
              }
            }
          }).populate("users", "-password").populate("groupAdmin", "-password").populate("lastMessage").sort({
            updatedAt: -1
          }).then(function _callee2(results) {
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(User.populate(results, {
                      path: "lastMessage.sender",
                      select: "name email"
                    }));

                  case 2:
                    results = _context2.sent;
                    res.status(200).send(results);

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          _context3.next = 8;
          break;

        case 4:
          _context3.prev = 4;
          _context3.t0 = _context3["catch"](0);
          res.status(400);
          throw new Error(_context3.t0.message);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
var createGroup = asyncHandler(function _callee4(req, res) {
  var users, groupChat, fullGroupChat;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!req.body.users || !req.body.name)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.status(400).send({
            message: "Please Fill lthe required information"
          }));

        case 2:
          users = JSON.parse(req.body.users);

          if (!(users.length < 2)) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).send("More than 2 users are required to form a group chat"));

        case 5:
          users.push(req.user);
          _context4.prev = 6;
          _context4.next = 9;
          return regeneratorRuntime.awrap(Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
          }));

        case 9:
          groupChat = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: groupChat._id
          }).populate("users", "-password").populate("groupAdmin", "-password"));

        case 12:
          fullGroupChat = _context4.sent;
          res.status(200).json(fullGroupChat);
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](6);
          res.status(400);
          throw new Error(_context4.t0.message);

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 16]]);
});
var reGroup = asyncHandler(function _callee5(req, res) {
  var _req$body, chatId, chatName, updatedChat;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, chatId = _req$body.chatId, chatName = _req$body.chatName;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(chatId, {
            chatName: chatName
          }, {
            "new": true
          }).populate("users", "-password").populate("groupAdmin", "-password"));

        case 3:
          updatedChat = _context5.sent;

          if (updatedChat) {
            _context5.next = 9;
            break;
          }

          res.status(404);
          throw new Error("Chat Not Found");

        case 9:
          res.json(updatedChat);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
});
var addGroup = asyncHandler(function _callee6(req, res) {
  var _req$body2, chatId, userId, added;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body2 = req.body, chatId = _req$body2.chatId, userId = _req$body2.userId;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(chatId, {
            $addToSet: {
              users: userId
            }
          }, {
            "new": true
          }).populate("users", "-password").populate("groupAdmin", "-password"));

        case 3:
          added = _context6.sent;

          if (added) {
            _context6.next = 9;
            break;
          }

          res.status(404);
          throw new Error("Chat Unavailable");

        case 9:
          res.json(added);

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
});
var removeGroup = asyncHandler(function _callee7(req, res) {
  var _req$body3, chatId, userId, chat, removed;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body3 = req.body, chatId = _req$body3.chatId, userId = _req$body3.userId;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Chat.findById(chatId));

        case 3:
          chat = _context7.sent;

          if (!(chat.groupAdmin.toString() === userId)) {
            _context7.next = 7;
            break;
          }

          res.status(400);
          throw new Error("Cannot remove group admin");

        case 7:
          _context7.next = 9;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(chatId, {
            $pull: {
              users: userId
            }
          }, {
            "new": true
          }).populate("users", "-password").populate("groupAdmin", "-password"));

        case 9:
          removed = _context7.sent;

          if (removed) {
            _context7.next = 15;
            break;
          }

          res.status(404);
          throw new Error("Chat Unavailabe");

        case 15:
          res.json(removed);

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  });
});
module.exports = {
  accessChat: accessChat,
  getChats: getChats,
  createGroup: createGroup,
  reGroup: reGroup,
  addGroup: addGroup,
  removeGroup: removeGroup
};