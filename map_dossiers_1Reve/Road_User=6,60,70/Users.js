const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");

const userCtrl = require("../controllers/users");

router.post("/login", userCtrl.login);

//Déclenche le middleware et attend la réponse de la donné User disponible ensuite
router.get("/auth", validateToken, userCtrl.auth);

router.post("/", userCtrl.signup);


//Basic info renvoit toutes les infos d'un utilisateur chosit par rapport à son ID = Controller req.params + SET State 
router.get("/basicinfo/:id", userCtrl.basicInfo);



router.get("/postpriv/:id", userCtrl.postpriv);

router.put("/changepassword", validateToken, userCtrl.changepassword);

router.put("/changepasswordreq", validateToken, userCtrl.changepasswordreq);

router.delete("/:id", userCtrl.delete);

router.post("/recup", userCtrl.recup);


module.exports = router;
