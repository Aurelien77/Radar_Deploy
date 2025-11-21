const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const CommentCtrl = require("../controllers/comments");

router.get("/:postId", CommentCtrl.postId);

router.post("/", validateToken, CommentCtrl.postid);

router.delete("/:commentId", validateToken, CommentCtrl.commentId);

module.exports = router;
