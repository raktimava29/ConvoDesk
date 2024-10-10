"use strict";

var asyncHandler = require("express-async-handler");

var User = require("../models/userModel");

var genToken = require("../config/genToken");

var registerUser = asyncHandler(function _callee(req, res) {
  var _req$body, name, email, password, userExists, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;

          if (!(!name || !email || !password)) {
            _context.next = 4;
            break;
          }

          res.status(400);
          throw new Error("Cannot Register User");

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 10;
            break;
          }

          res.status(400);
          throw new Error("User already exists");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            password: password
          }));

        case 12:
          user = _context.sent;

          if (!user) {
            _context.next = 17;
            break;
          }

          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: genToken(user._id)
          });
          _context.next = 19;
          break;

        case 17:
          res.status(400);
          throw new Error("User not found");

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
});
var authUser = asyncHandler(function _callee2(req, res) {
  var _req$body2, email, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context2.sent;
          _context2.t0 = user;

          if (!_context2.t0) {
            _context2.next = 9;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(user.matchPassword(password));

        case 8:
          _context2.t0 = _context2.sent;

        case 9:
          if (!_context2.t0) {
            _context2.next = 13;
            break;
          }

          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: genToken(user._id)
          });
          _context2.next = 15;
          break;

        case 13:
          res.status(401);
          throw new Error("Invalid Email or Password");

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var allUsers = asyncHandler(function _callee3(req, res) {
  var keyword, users;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          keyword = req.query.search ? {
            $or: [{
              name: {
                $regex: req.query.search,
                $options: "i"
              }
            }, {
              email: {
                $regex: req.query.search,
                $options: "i"
              }
            }]
          } : {};
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.find(keyword).find({
            _id: {
              $ne: req.user._id
            }
          }));

        case 3:
          users = _context3.sent;
          res.send(users);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = {
  registerUser: registerUser,
  authUser: authUser,
  allUsers: allUsers
};