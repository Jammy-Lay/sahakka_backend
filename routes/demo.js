const express = require("express");
const router = express.Router();

const demo = require("../controllers/demo");
const { isLogin } = require("../middlewares/auth");

router.put("/approved/:task_id", isLogin, demo.updateToApproved);
router.put("/rejected/:task_id", isLogin, demo.updateToRejected);
router.get("/getTask", isLogin, demo.getTask);

module.exports = router;
