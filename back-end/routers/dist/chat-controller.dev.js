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
  var _req$body, name, users, parsedUsers, existingGroup, groupChat, fullGroupChat;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, users = _req$body.users;

          if (!(!users || !name)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Please fill all the required information"
          }));

        case 3:
          parsedUsers = JSON.parse(users);

          if (!(parsedUsers.length < 2)) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "At least 2 users are required to form a group chat"
          }));

        case 6:
          parsedUsers.push(req.user);
          _context4.prev = 7;
          _context4.next = 10;
          return regeneratorRuntime.awrap(Chat.findOne({
            chatName: name,
            isGroupChat: true
          }));

        case 10:
          existingGroup = _context4.sent;

          if (!existingGroup) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "A group with this name already exists!"
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(Chat.create({
            chatName: name,
            users: parsedUsers,
            isGroupChat: true,
            groupAdmin: req.user
          }));

        case 15:
          groupChat = _context4.sent;
          _context4.next = 18;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: groupChat._id
          }).populate("users", "-password").populate("groupAdmin", "-password"));

        case 18:
          fullGroupChat = _context4.sent;
          res.status(201).json(fullGroupChat);
          _context4.next = 25;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](7);
          res.status(500).json({
            message: _context4.t0.message
          });

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[7, 22]]);
});
var reGroup = asyncHandler(function _callee5(req, res) {
  var _req$body2, chatId, chatName, updatedChat;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, chatId = _req$body2.chatId, chatName = _req$body2.chatName;
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
  var _req$body3, chatId, userId, added;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body3 = req.body, chatId = _req$body3.chatId, userId = _req$body3.userId;
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
  var _req$body4, chatId, userId, chat, removed;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body4 = req.body, chatId = _req$body4.chatId, userId = _req$body4.userId;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Chat.findById(chatId));

        case 3:
          chat = _context7.sent;

          if (chat) {
            _context7.next = 7;
            break;
          }

          res.status(404);
          throw new Error("Chat not found");

        case 7:
          if (!(chat.groupAdmin.toString() === userId && req.user._id.toString() !== userId)) {
            _context7.next = 10;
            break;
          }

          res.status(400);
          throw new Error("Cannot remove group admin");

        case 10:
          if (!(chat.users.length === 3)) {
            _context7.next = 14;
            break;
          }

          _context7.next = 13;
          return regeneratorRuntime.awrap(Chat.findByIdAndDelete(chatId));

        case 13:
          return _context7.abrupt("return", res.json({
            message: "Group deleted"
          }));

        case 14:
          _context7.next = 16;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(chatId, {
            $pull: {
              users: userId
            }
          }, {
            "new": true
          }).populate("users", "-password").populate("groupAdmin", "-password"));

        case 16:
          removed = _context7.sent;

          if (removed) {
            _context7.next = 20;
            break;
          }

          res.status(404);
          throw new Error("Chat unavailable");

        case 20:
          res.json(removed);

        case 21:
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