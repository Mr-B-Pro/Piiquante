// ------ CREATION UTILISATEUR ------//

// - CONNEXION DATABASE : - //
// Importation mongo => base de données
const { User } = require("../mongo");
// Importation bcrypt => crypte des données
const bcrypt = require("bcrypt");

// - SIGN UP UTILISATEUR : - //
// Function createUser => sert de modèle pour créer un compte sur notre site
async function createUser(req, res) {
  const { email, password } = req.body;
  // hashedPassword => crypte le mot de passe
  const hashedPassword = await hashPassword(password);
  console.log("password:", password);
  console.log("hashedPassword:", hashedPassword);
  const user = new User({ email, password: hashedPassword });

  user
    .save()
    // status 201 => ressource crée
    .then(() => res.status(201).send({ message: "Utilisateur enregistré !" }))
    // status 409 => conflit avec l'état actuel du server
    .catch((err) =>
      res.status(409).send({ message: "User pas enregistré :" + err })
    );
}

// Function hashPassword => crypte les mots de passe
function hashPassword(password) {
  // saltRounds => chiffre 10 fois
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// - LOGIN UTILISATEUR : - //
function logUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
}

// - EXPORTATION : - //
// createUser => exportation du modèle utilisateur
module.exports = { createUser, logUser };
