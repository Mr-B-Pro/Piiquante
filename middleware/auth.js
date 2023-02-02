// ------ AUTHENTIFICATION UTILISATEUR  ------ //

// - IMPORTATION PACKAGES : - //
// Importation jsonwebtoken => création token
const jwt = require("jsonwebtoken");

// Function authentificateUser => sert à authentifier utilisateur
function authentificateUser(req, res, next) {
  console.log("authenticate user");
  // req.header => recupere token de la requête dans headers authorization
  const header = req.header("Authorization");
  // si headers n'est pas défini =>  renvoi status 403 conflit avec l'état actuel du server
  if (header == null) return res.status(403).send({ message: "Invalide !" });

  // si trouve le token => split donc separe elements + 1 donc recupere deuxieme element du token
  const token = header.split(" ")[1];
  // si token n'est pas défini =>  renvoi status 403 conflit avec l'état actuel du server
  if (token == null)
    return res.status(403).send({ message: "Le token n'est pas null !" });

  // jwt.verify => sert à verifier en decryptant token + verifi le mot de passe + invocation function
  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    // si token est pas ok => renvoi status 403 conflit avec l'état actuel du server
    if (err)
      return res
        .status(403)
        .send({ message: "Le token est invalide ! " + err });
    // si token est ok
    console.log("Le token est bien valide, on continue !");
    next();
  });
}

// - EXPORTATION : - //
// Exportation authentificateUser => authentifier utilisateur
module.exports = { authentificateUser };
