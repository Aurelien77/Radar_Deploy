const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "uploadsfichiers");
  },
  filename: (req, file, callback) => {
    const iduser = req.user.id;

    const numdeck = req.headers["x-deck-number"];


    
    
    const randomNum = Math.floor(Math.random() * 10000) + 1;
    const name = randomNum;
   
    const extension = MIME_TYPES[file.mimetype];
 
    callback(null, iduser + "/" + "decks" + "/" + numdeck + "/"+ "1reve" + name + Date.now() + '.' + extension);
  },
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadFile;
