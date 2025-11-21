
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    "image/webp": "webp",
};

const storage = multer.diskStorage({
  
    destination: (req, file, cb) => {
     
        cb(null, "uploadsfichiers"); 
    },
   
    filename: (req, file, callback) => {
      
       const iduser = req.user.id;

   
   
   
       
       
       const randomNum = Math.floor(Math.random() * 10000) + 1;
       const name = randomNum;
       
       const extension = MIME_TYPES[file.mimetype];
     
       callback(null,iduser + "/" + "profile"+  "/"+ "1reve"+  name + Date.now() + '.' + extension);
    }
});

module.exports = multer({
    storage: storage
}).single('image');