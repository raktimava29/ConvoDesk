const express = require("express");
const { protect } = require("../protection/protect");
const { accessChat, getChats, reGroup, addGroup, removeGroup, createGroup } = require("./chat-controller");

const router = express.Router();

router.route('/').post(protect,accessChat)
router.route('/').get(protect,getChats)
router.route('/group').post(protect,createGroup)
router.route('/reGroup').put(protect,reGroup)
router.route('/addGroup').put(protect,addGroup)
router.route('/remGroup').put(protect,removeGroup)

module.exports = router;