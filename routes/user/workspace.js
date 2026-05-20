const express = require("express");
const router = express.Router();

const workspace = require("../../controllers/user/workspace");
const { isLogin } = require("../../middlewares/auth");

router.post("/create-workspace", isLogin, workspace.createWorkspace);
router.get("/getMyWorkspace", isLogin, workspace.getMyWorkspace);

module.exports = router;
