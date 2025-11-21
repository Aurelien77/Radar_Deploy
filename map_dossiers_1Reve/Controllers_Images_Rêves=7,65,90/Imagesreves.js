const { Posts } = require("../models");


exports.telechargerimagesreves = async (req, res) => {
  const post = req.body;

  post.title = req.body.description;

  post.categorie = req.body.categorie;

  const numdeck = [req.body.dossier];

  post.postText = req.body.text;

  post.username = req.user.username; //Recup du middle
  post.UserId = req.user.id;

  const userid = [req.user.id];

 

 

  /* const result = await uploadFile(userid, numdeck, file); */

  post.lien = `https://1reve.net/app/uploadsfichiers/${req.file.filename}`, 
  await Posts.create(post);
 
res.send("Le poste à bien été effectué");
};

exports.lireimageseves = async (req, res) => {
  console.log("req.Location");
  console.log(req.params.Location);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
};
