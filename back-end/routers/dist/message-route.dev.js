"use strict";

var express = require("express");

var _require = require("../protection/protect"),
    protect = _require.protect;

var _require2 = require("./message-controller"),
    allMessages = _require2.allMessages,
    sendMessage = _require2.sendMessage;

var router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
module.exports = router;