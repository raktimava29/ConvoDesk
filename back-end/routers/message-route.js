const express = require("express");
const { protect } = require("../protection/protect");
const { allMessages, sendMessage } = require("./message-controller");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
