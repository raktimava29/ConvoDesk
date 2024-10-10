"use strict";

var _user_icon = _interopRequireDefault(require("./user_icon.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true,
    "default": _user_icon["default"]
  }
}, {
  timestamps: true
});
var User = mongoose.Model("User", userSchema);
module.exports = User;