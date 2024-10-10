"use strict";

var express = require("express");

var _require = require("./user-controller"),
    registerUser = _require.registerUser,
    authUser = _require.authUser,
    allUsers = _require.allUsers;

var _require2 = require("../protection/protect"),
    protect = _require2.protect;

var router = express.Router();
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
module.exports = router;