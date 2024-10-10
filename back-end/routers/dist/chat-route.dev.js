"use strict";

var express = require("express");

var _require = require("../protection/protect"),
    protect = _require.protect;

var _require2 = require("./chat-controller"),
    accessChat = _require2.accessChat,
    getChats = _require2.getChats,
    reGroup = _require2.reGroup,
    addGroup = _require2.addGroup,
    removeGroup = _require2.removeGroup,
    createGroup = _require2.createGroup;

var router = express.Router();
router.route('/').post(protect, accessChat);
router.route('/').get(protect, getChats);
router.route('/group').get(protect, createGroup);
router.route('/reGroup').put(protect, reGroup);
router.route('/addGroup').put(protect, addGroup);
router.route('/remGroup').put(protect, removeGroup);
module.exports = router;