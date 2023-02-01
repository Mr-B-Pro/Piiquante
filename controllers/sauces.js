// ------ CREATION SAUCES ------ //

// - IMPORTATION PACKAGES : - //
// Importation jsonwebtoken => création token
const jwt = require("jsonwebtoken");

// - VOIR LES SAUCES UTILISATEURS : - //
// Function getSauces => sert à obtenir sauces utilisateur
function getSauces(req, res) {
  // req.header => recupere token de la requête dans headers authorization
  const header = req.header("Authorization");
  // si headers n'est pas défini =>  renvoi status 403 conflit avec l'état actuel du server
  if (header == null) return res.status(403).send({ message: "Invalide !" });
  // si trouve le token => split donc separe elements + 1 donc recupere deuxieme element du token
  const token = header.split(" ")[1];
  // si token n'est pas défini =>  renvoi status 403 conflit avec l'état actuel du server
  if (token == null)
    return res.status(403).send({ message: "Token n'est pas null !" });
  // jwt.verify => sert à verifier en decryptant token + verifi le mot de passe + invocation function
  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) =>
    handleToken(err, decoded, res)
  );
}

// - GERER LE TOKEN : - //
// Function handleToken => sert à gerer le le token
function handleToken(err, decoded, res) {
  // si token pas ok => status 403 conflit avec l'état actuel du server
  if (err) res.status(403).send({ message: "Token invalide " + err });
  // si token ok =>
  else {
    console.log("Le token a l'air bon", decoded);
    res.send({ message: "Ok, voici toutes les sauces." });
  }
}

// - EXPORTATION : - //
// Exportation objets getSauces => modèles creation sauces
module.exports = { getSauces };
