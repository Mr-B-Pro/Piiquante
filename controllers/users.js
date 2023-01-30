// ------ CREATION UTILISATEUR ------//

// - CONNEXION DATABASE : - //
// Importation mongo => base de données
const { User } = require("../mongo");

// - SIGN UP UTILISATEUR : - //
// Function createUser => sert de modèle pour créer un compte sur notre site
function createUser(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });

  user
    .save()
    .then(() => res.send({ message: "Utilisateur enregistré !" }))
    .catch((err) => console.log("User pas enregistré !", err));
}

// - EXPORTATION : - //
// createUser => exportation du modèle utilisateur
module.exports = { createUser };
