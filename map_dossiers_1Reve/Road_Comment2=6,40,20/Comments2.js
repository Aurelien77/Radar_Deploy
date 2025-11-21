const express = require("express");
const router = express.Router();
const { Comments2 } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const Comment2Ctrl = require("../controllers/comments2");

router.get("/:postId", Comment2Ctrl.postId);

router.post("/", validateToken, Comment2Ctrl.postid);

router.delete("/:commentId", validateToken, Comment2Ctrl.commentId);

module.exports = router;
