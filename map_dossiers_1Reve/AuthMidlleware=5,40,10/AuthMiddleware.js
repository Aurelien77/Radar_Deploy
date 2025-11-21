const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  /* console.log("le tokennnn", accessToken) */
  if (!accessToken)
    return res.json({ error: "Utilisateur n'est pas connecté !" });

  try {
    const validToken = verify(accessToken, `${process.env.CryptoJs_cle_token}`);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
