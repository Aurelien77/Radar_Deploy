const { Posts, Posts2, Posts3, Likes, Comments } = require("../../models");

//Retourne la liste de tout les posts

exports.posts = async (req, res) => {
  //listes des posts page principale
  const listOfPosts = await Posts3.findAll();

  /*   const CommentsPosts = await Comments.findAll({
      where: { PostId: req.post.id },
    }); */

  res.json({ listOfPosts: listOfPosts });
};






exports.post = async (req, res) => {
  //crer un post

 
  const post = req.body;


  /* post.renseignement = req.headers.checked; */
  console.log( "post.renseignement" )
  console.log( post.renseignement )
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts3.create(post);
  res.json(post);
};

//Renvoi UN POST UNIQUE PAR SON ID
exports.id = async (req, res) => {
  const id = req.params.id;
  const post = await Posts3.findByPk(id);
  res.json(post);
};




//LIRE FICHE DE RENSEIGNEMENT 
exports.renseignements = async (req, res) => {
  const id = req.params.id;
  const post = await Posts3.findAll({
    where: { UserId: id, renseignement: "true"},
    
  
})
  res.json(post);
};




exports.id2 = async (req, res) => {
  const id = req.params.id;
  const post = await Posts3.findByPk(id);
  res.json(post);
};

/* exports.idpriv = async (req, res) => {
  const id = req.params.id;
  const post = await Posts2.findByPk(id);
  res.json(post);
}; */

exports.userid = async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts3.findAll({
    where: { UserId: id, renseignement:"false" },
  });
  res.json(listOfPosts);
};

exports.useridpriv = async (req, res) => {
  const id2 = req.params.id;
  const listOfPosts = await Posts3.findAll({
    where: { UserId: id2 },
    include: [Likes],
  });
  res.json(listOfPosts);
};

exports.title = async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts3.update({ title: newTitle }, { where: { id: id } });

  
  res.json(newTitle);


};

exports.checked = async (req, res) => {
  try{
  const { id, checked } = req.body;
  await Posts3.update({ checked: checked}, { where: { id: id } });
  console.log("Hid")
 console.log(id)

 console.log("checked")
 console.log(checked)
  res.json(checked);
  }catch{
  
    res.status(500).json("Erreur de lod data")

  }
  


};

exports.posttext = async (req, res) => {
  const { newText, id } = req.body;
  await Posts3.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
};


exports.postlien = async (req, res) => {
  const { lien, id } = req.body;
  await Posts3.update({ lien : lien }, { where: { id: id } });
  res.json(lien);
};
exports.postId = async (req, res) => {
  const postId = req.params.postId;
  await Posts3.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
};
