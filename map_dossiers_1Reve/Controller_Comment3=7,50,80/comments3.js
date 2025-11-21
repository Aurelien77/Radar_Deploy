const { Comments3 } = require("../models");
const { id } = require("./VuPostsOne/posts");

exports.postId = async (req, res) => {
  //Retourne tous les résultats du commentaire par posts
  const postId = req.params.postId;
  const comments = await Comments3.findAll({ where: { Posts3Id: postId } });
  res.json(comments);
};


exports.postid = async (req, res) => {
  //créer le commentaire
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments3.create(comment);
  res.json(comment);

};

exports.commentId = async (req, res) => {
  //supprimer le commentaire
  const commentId = req.params.commentId;

  await Comments3.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
};

