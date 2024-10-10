"use strict";

var jwt = require("jsonwebtoken");

var genToken = function genToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: "30D"
  });
};

module.exports = genToken;