const { PostsDeck } = require("../models");
const fs = require('fs');
const path = require("path");

require("dotenv").config();

///////////////////////////////////////////////////////////////////////

exports.delete = async (req, res) => {
   
  
    
  try{
  
      const postId = req.params.postId;

    
/*   fs.unlinkSync(lientrans); */
  



  const ancienfichiersupr = req.headers.lien;
  const startIndex = ancienfichiersupr.indexOf("/uploadsfichiers");
  const cheminDansUploads = ancienfichiersupr.substring(startIndex); 


  const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers"); 

  
  const localFilePath = path.join(uploadDirectory, cheminDansUploads.replace("/uploadsfichiers", ""));



  

  fs.unlink(localFilePath, (err) => {
    if (err) {

    

      console.error('Error deleting file:', err);
    } else {

 
      
      console.log('File deleted successfully:', localFilePath);
    }
  });
    

      
  
      await PostsDeck.destroy({
        where: {
          id: postId,
        },
        
      });
    
      res.json("DELETED SUCCESSFULLY");
  }
  
  catch(error){
  console.log(error)
      res.status(500).json({ message: 'Erreur lors de la suppressions des données' });
  }
  
  
  
  
    }
exports.update = async (req, res, cb) => {
  try {
    const verificationfile = req.file;
    if (verificationfile) {
      const delaiEnMillisecondes = 5000; // 5 secondes
     /*  setTimeout(() => {
 */
        const ancienfichiersupr = req.body.ancienfichier;
        const startIndex = ancienfichiersupr.indexOf("/uploadsfichiers");
        const cheminDansUploads = ancienfichiersupr.substring(startIndex); // Correction ici
    
        console.log(ancienfichiersupr, "Ancienfichier");
        const uploadDirectory = path.join(__dirname, "..", "uploadsfichiers"); // Chemin vers le dossier d'accès statique
    
        // Utilisez path.join pour construire correctement le chemin du fichier à supprimer
        const localFilePath = path.join(uploadDirectory, cheminDansUploads.replace("/uploadsfichiers", ""));
    
        // Maintenant, localFilePath devrait être correct
        console.log(localFilePath);
    
        

        fs.unlink(localFilePath, (err) => {
          if (err) {
  
          
    
            console.error('Error deleting file:', err);
          } else {
  
       
            
            console.log('File deleted successfully:', localFilePath);
          }
        });
         
   
      const postId = req.body.postId;
      const title = req.body.title;
      const postText = req.body.postText;

      const lien = `${process.env.API_URL}/uploadsfichiers/${req.file.filename}`; 
    

      await PostsDeck.update({ postText: postText, title: title, lien: lien }, { where: { id: postId } });
    } else {
      const postId2 = req.body.postId;
      const title = req.body.title;
      const postText = req.body.postText;

      await PostsDeck.update({ postText: postText, title: title }, { where: { id: postId2 } });
    }

    res.json("Update Successful");
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ message: 'Erreur update des données' });
  }
};




exports.telechargerimages = async (req, res) => {


    try{
        





      
const post =  req.body;


       post.lien = req.file.filename;
     
   
        const userid = [req.user.id];
      /*   const numdeck = [req.body.numberofdeck]; */
       /*  const post = req.body.userobjetuser;  */
post.background = req.body.background;
post.dos = req.body.fond;
post.presentation = req.body.presentation;

        post.id = req.body.id;

      

       post.lien = `${process.env.API_URL}/uploadsfichiers/${req.file.filename}`, 

        post.numberofdeck = req.body.numberofdeck;
        post.title = req.body.title;
        post.postText = req.body.postText;

        post.username = req.body.username;
       
        await PostsDeck.create(post);

        
     res.send("Le poste à bien été effectué") 

    }catch(error ){

       
        console.log("error dans creer un deck")
        console.log(error)
        res.status(500).json({ message: 'Erreur envoi de la donnée' });

    }
   




};


exports.lireimages = async (req, res) => { 

try {

const id = req.params.id;
const deck = req.params.postid;

console.log("deck")
console.log(deck)


    const listOfimagesdeck =
    
    
    await PostsDeck.findAll({
        where: { iduser: id, numberofdeck: deck, background: "false", dos:"false", presentation:"false" },
        
      
    });


    res.send(listOfimagesdeck) 


} catch(error){

    res.status(500).json({ message: 'Erreur lecture des données' });

}


  };


  exports.lireimagesBase = async (req, res) => { 

    try {
    

    const deck = req.params.postid;
    

    
    
        const listOfimagesdeck =
        
        
        await PostsDeck.findAll({
            where: {  numberofdeck: deck, background: "false", dos:"false", presentation:"false" },
            
          
        });
    
    
        res.send(listOfimagesdeck) 
    

    } catch(error){
    
        res.status(500).json({ message: 'Erreur lecture des données' });
    
    }
    
    
      };

  exports.lireimagesbackground = async (req, res) => { 

    try {
    
    const id = req.params.id;
    const deck = req.params.postid;
    
   
    
        const listOfimagesdeck =
        
        
        await PostsDeck.findAll({
            where: { iduser: id, numberofdeck: deck, background: "true",  dos:"false",presentation:"false"},
           
          
        });
    
    
        res.send(listOfimagesdeck) 

    } catch(error){
    
        res.status(500).json({ message: 'Erreur lecture des données' });
    
    }
    
    
      };


      exports.lireimagesbackgroundBase = async (req, res) => { 

        try {
        
  
        const deck = req.params.postid;
        
       
        
            const listOfimagesdeck =
            
            
            await PostsDeck.findAll({
                where: {  numberofdeck: deck, background: "true",  dos:"false",presentation:"false"},
               
              
            });
        
        
            res.send(listOfimagesdeck) 

        } catch(error){
        
            res.status(500).json({ message: 'Erreur lecture des données' });
        
        }
        
        
          };
      exports.lireimagesdos = async (req, res) => { 

        try {
        
        const id = req.params.id;
        const deck = req.params.postid;
        
       
        
            const listOfimagesdeck =
            
            
            await PostsDeck.findAll({
                where: { iduser: id, numberofdeck: deck, dos:"true", background:"false", presentation:"false"},
               
              
            });
        
        
            res.send(listOfimagesdeck) 

        } catch(error){
        
            res.status(500).json({ message: 'Erreur lecture des données' });
        
        }
        
        
          };
    

          exports.lireimagesdosBase = async (req, res) => { 

            try {
            
          
            const deck = req.params.postid;
            
           
            
                const listOfimagesdeck =
                
                
                await PostsDeck.findAll({
                    where: { numberofdeck: deck, dos:"true", background:"false", presentation:"false"},
                   
                  
                });
            
            
                res.send(listOfimagesdeck) 
            
            console.log("LIRE IMAGE DECK ")
            
            console.log(listOfimagesdeck)
            } catch(error){
            
                res.status(500).json({ message: 'Erreur lecture des données' });
            
            }
            
            
              };


  exports.lireimagespresentation = async (req, res) => { 

            try {
            
            const id = req.params.id;
            const deck = req.params.postid;
            
           
            
                const listOfimagesdeck =
                
                
                await PostsDeck.findAll({
                    where: { iduser: id, numberofdeck: deck,  presentation:"true",  dos:"false", background:"false"},
                   
                  
                });
            
            
                res.send(listOfimagesdeck) 
            

            } catch(error){
            
                res.status(500).json({ message: 'Erreur lecture des données' });
            
            }
            
            
              };

              
  exports.lireimagespresentationBase = async (req, res) => { 

    try {
 
    const deck = req.params.postid;
    
   
    
        const listOfimagesdeck =
        
        
        await PostsDeck.findAll({
            where: { numberofdeck: deck,  presentation:"true",  dos:"false", background:"false"},
           
          
        });
    
    
        res.send(listOfimagesdeck) 
    

    } catch(error){
    
        res.status(500).json({ message: 'Erreur lecture des données' });
    
    }
    
    
      };
   

