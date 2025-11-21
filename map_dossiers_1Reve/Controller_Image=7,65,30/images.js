const { Posts2 } = require("../models");

const{ Users } = require("../models");


require("dotenv").config();


const apiUrl = process.env.API_URL;

const path = require("path"); 
const fs = require('fs');


exports.telechargerimages = async (req, res) => {
  const post = req.body;
 
  post.title = req.body.description;

  const numdeck = [req.body.dossier];
  post.categorie = req.body.categorie;
  post.postText = req.body.text;

  post.username = req.user.username; //Recup du middle

  post.UserId = req.user.id;

  const userid = [req.user.id];

  /* fichier = nom modifier par multer  */



/*   const result = await uploadFile(file, userid, numdeck); */

post.lien = `${process.env.API_URL}uploadsfichiers/${req.file.filename}`, 
/*   post.lien = `https://expclients.com/uploadsfichiers/${req.file.filename}`,    */ 
  /*     https://expclients.com */
 /*   http://127.0.0.1:3001 */
  await Posts2.create(post);

  res.send("Le poste à bien été effectué");
};


exports.telechargerimagesphoto = async (req, res) => {

  try {

if (req.headers.ancienfichier === null) {

  const post = req.body;

  post.lien = req.body.lien;

const id = req.body.iduser;
/*   const userid = [req.user.id]; */

  /* fichier = nom modifier par multer  */

/*   const file = Object.assign(userid, req.file);

  const result = await uploadFile(userid,"p", file); */

/*   (post.lien = result.Location),  */
post.lien = `${process.env.API_URL}/uploadsfichiers/${req.file.filename}`, 
/* post.lien = `https://expclients.com/uploadsfichiers/${req.file.filename}`,   */  
  await Users.update({ photo_profil: post.lien},{ where: { id: id } });
  console.log('\x1b[31m%s\x1b[0m', lien, "Lien");
  console.log('\x1b[31m%s\x1b[0m', ancienfichiersupr, "AncienFichier a suppppppppppppp PHOTO");
 





}else {
 
 






   
/*     https://expclients.com */
 /*   http://127.0.0.1:3001 */




 const ancienfichiersupr = req.headers.ancienfichier;


 

 const startIndex = ancienfichiersupr.indexOf("/uploadsfichiers");


 const cheminDansUploads = ancienfichiersupr.substring(startIndex); // Correction ici

 console.log('\x1b[31m%s\x1b[0m', cheminDansUploads, "AncienFichier a suppppppppppppp");
 const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers"); // Chemin vers le dossier d'accès statique

 // Utilisez path.join pour construire correctement le chemin du fichier à supprimer
 const localFilePath = path.join(uploadDirectory, cheminDansUploads.replace("/uploadsfichiers", ""));

 // Maintenant, localFilePath devrait être correct
 console.log('\x1b[31m%s\x1b[0m',localFilePath);

 

 fs.unlink(localFilePath, (err) => {
   if (err) {

   

     console.error('Error deleting file:', err);
   } else {


     
     console.log('File deleted successfully:', localFilePath);
   }
 });
     


 const post = req.body;

 post.lien = req.body.lien;

const id = req.body.iduser;
 const userid = [req.user.id];

 post.lien = `${process.env.API_URL}/uploadsfichiers/${req.file.filename}`,    


 await Users.update({ photo_profil: post.lien},{ where: { id: id } });

  res.send("Le poste à bien été effectué");
}
} catch(error) {
  
  res.send("ERREUR d'ajout de la données");
  ancienfichier = req.headers.ancienfichier;

 
}
};

exports.lireimages = async (req, res) => {
  console.log("req.Location");
  console.log(req.params.Location);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
};



