const express = require("express");
const router = express.Router();
const { Comments3 } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const Comment3Ctrl = require("../controllers/comments3");

router.get("/:postId", Comment3Ctrl.postId);

router.post("/", validateToken, Comment3Ctrl.postid);

router.delete("/:commentId", validateToken, Comment3Ctrl.commentId);

module.exports = router;
