const express = require("express")
const { registerUser, authUser, allUsers } = require("./user-controller")
const { protect } = require("../protection/protect")

const router = express.Router()

router.route("/").post(registerUser).get(protect,allUsers)
router.post("/login",authUser)

module.exports = router;