const { Comments } = require("../models");

exports.postId = async (req, res) => {
  //Retourne tous les résultats du commnetaire par posts
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
};

exports.postid = async (req, res) => {
  //créer le commentaire
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  res.json(comment);
};

exports.commentId = async (req, res) => {
  //supprimer le commentaire
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
};
//Commentaire 

