// ------ CREATION + CONNEXION UTILISATEUR ------//

// - CONNEXION DATABASE : - //
// Importation objet user => locale mongodb base de données
const { User } = require("../mongo");

// - IMPORTATION PACKAGES : - //
// Importation bcrypt => crypte les données sensibles
const bcrypt = require("bcrypt");

// - SIGN UP UTILISATEUR : - //
// Function asynchrone createUser => sert de modèle creation compte utilisateur
async function createUser(req, res) {
  const { email, password } = req.body;
  // invocation function hashPassword => crypte le mot de passe
  const hashedPassword = await hashPassword(password);
  // schema user => objet création email + mot de passe cryptés
  const user = new User({ email, password: hashedPassword });
  // sauvegarde => modele creation compte utilisateur
  user
    .save()
    // status 201 => ressource crée
    .then(() => res.status(201).send({ message: "Utilisateur enregistré !" }))
    // status 409 => conflit avec l'état actuel du server
    .catch((err) =>
      res.status(409).send({ message: "Utilisateur pas enregistré: " + err })
    );
}

// Function hashPassword => crypte les mots de passe
function hashPassword(password) {
  // saltRounds => chiffre 10 fois
  const saltRounds = 10;
  // renvoi le mot de passe crypté + chiffré 10 fois
  return bcrypt.hash(password, saltRounds);
}

// - LOGIN UTILISATEUR : - //
// Function logUser => sert de modèle connexion compte utilisateur
function logUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
}

// - EXPORTATION : - //
// Exportation objets createUser, logUser => modèles creation + connexion utilisateur
module.exports = { createUser, logUser };
