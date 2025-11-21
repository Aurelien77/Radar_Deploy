

const express = require("express");
const router = express.Router();

const { validateToken } = require("../middlewares/AuthMiddleware");
const imagesController = require("../controllers/ImagesDeck");


const multer = require("../middlewares/multerDeck");





router.post("/",  validateToken,multer,imagesController.telechargerimages);







router.get("/liredeck/:id/:postid",validateToken, imagesController.lireimages);

router.get("/liredeckBase/:postid",validateToken, imagesController.lireimagesBase);


router.get("/lirebackground/:id/:postid",validateToken, imagesController.lireimagesbackground);

router.get("/lirebackgroundBase/:postid",validateToken, imagesController.lireimagesbackgroundBase);


router.get("/lireimagespresentation/:id/:postid",validateToken, imagesController.lireimagespresentation);


router.get("/lireimagespresentationBase/:postid",validateToken, imagesController.lireimagespresentationBase);

router.get("/lireimagesdos/:id/:postid",validateToken, imagesController.lireimagesdos);

router.get("/lireimagesdosBase/:postid",validateToken, imagesController.lireimagesdosBase);


router.delete("/:postId",validateToken, imagesController.delete);


router.put("/",  validateToken,multer,imagesController.update);




module.exports = router;



  