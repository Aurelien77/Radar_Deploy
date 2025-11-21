const { Posts2, Likes2} = require("../../models");

const fs = require('fs');
const path = require("path");

exports.posts = async (req, res) => {
  //liste des posts de la page principale
  const listOfPosts = await Posts2.findAll({ include: [Likes2] });
  const likedPosts = await Likes2.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
};

exports.post = async (req, res) => {
  const post = req.body;
  post.username = req.user.username; //Recup du middle
  post.UserId = req.user.id;
  (post.lien = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`),
  await Posts2.create(post);
  res.json(post);
};

exports.id = async (req, res) => {
  const id = req.params.id;
  const post = await Posts2.findByPk(id);
  res.json(post);
};

exports.id2 = async (req, res) => {
  const id = req.params.id;
  const post = await Posts2.findByPk(id);
  res.json(post);
};

exports.userid = async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts2.findAll({
    where: { UserId: id },
    include: [Likes2],
  });
  res.json(listOfPosts);
};

exports.title = async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts2.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
};

exports.posttext = async (req, res) => {
  const { newText, id } = req.body;
  await Posts2.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
};

exports.postId = async (req, res) => {
  try {
   
    const postId = req.params.postId;
const user = req.user.id.toString(); // Convertir en chaîne de caractères
const ancienfichiersupr = req.headers.lien.toString(); // Convertir en chaîne de caractères
const startIndex = 37;
const cheminDansUploads = ancienfichiersupr.substring(startIndex);

console.log('\x1b[31m%s\x1b[0m', cheminDansUploads, "AncienFichier a suppppppppppppp");

const uploadDirectory = path.join("uploadsfichiers"); // Chemin vers le dossier d'accès statique

// Utilisez path.join pour construire correctement le chemin du fichier à supprimer
const localFilePath = path.join(uploadDirectory, cheminDansUploads);



fs.unlink(localFilePath, (err) => {
  if (err) {
    console.error('Error deleting file:', err);
  } else {
    console.log('File deleted successfully:', localFilePath);
  }
});

    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully:', localFilePath);
      }
    });

    await Posts2.destroy({
      where: {
        id: postId,
      },
    });

    res.json("DELETED SUCCESSFULLY");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("ERREUR lors de la suppression");
  }
};
