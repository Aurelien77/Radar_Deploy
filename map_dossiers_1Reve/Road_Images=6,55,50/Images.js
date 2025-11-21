

const express = require("express");
const router = express.Router();
const imagesController = require("../controllers/images");
const { validateToken } = require("../middlewares/AuthMiddleware");

/* const multer = require('multer')

const upload = multer({ dest: 'uploads/' }) */




const multer = require("../middlewares/UploadProfil");

const multer2 = require("../middlewares/Upload");


router.post("/",  validateToken,multer2,imagesController.telechargerimages);

router.put("/photo",  validateToken,multer,imagesController.telechargerimagesphoto);

/* router.get("/images/:key", validateToken, multer, imagesController.lireimages);
 */

router.get("/images/:key", validateToken, multer2,imagesController.lireimages);


module.exports = router;



  