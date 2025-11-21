const { Comments2 } = require("../models");
const { id } = require("./VuPostsOne/posts");

exports.postId = async (req, res) => {
  //Retourne tous les résultats du commentaire par posts
  const postId = req.params.postId;
  const comments = await Comments2.findAll({ where: { Posts2Id: postId } });
  res.json(comments);
};


exports.postid = async (req, res) => {
  //créer le commentaire
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments2.create(comment);
  res.json(comment);

};

exports.commentId = async (req, res) => {
  //supprimer le commentaire
  const commentId = req.params.commentId;

  await Comments2.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
};

