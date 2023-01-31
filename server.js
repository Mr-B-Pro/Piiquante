// ------ CREATION SERVEUR ------//

// - IMPORTATION PACKAGES : - //
// Importation dotenv => masque les données sensibles
require("dotenv").config();
// Importation express => framework minimaliste basé sur node.js
const express = require("express");
// Invocation function express => framework minimaliste basé sur node.js
const app = express();
// Ecoute du port => 3000
const port = 3000;
// Importation cors => pour ajouter des headers
const cors = require("cors");

// - CONNEXION DATABASE : - //
// Importation locale mongodb => base de données
require("./mongo");

// - CONTROLLERS : - //
//  Importation objets createUser + logUser =>  locale modèles création + connexion utilisateur
const { createUser, logUser } = require("./controllers/users");

// - MIDDLEWARE : - //
// Invocation function cors => pour ajouter des headers
app.use(cors());
// Invocation function express.json => parse les données des requêtes post en json
app.use(express.json());

// - ROUTES : - //
// Chemin post authentification signup => invoque function creation utilisateur
app.post("/api/auth/signup", createUser);
// Chemin post authentification login => invoque function connexion utilisateur
app.post("/api/auth/login", logUser);
// Chemin get => execute la function qui affiche hello world
app.get("/", (req, res) => res.send("Hello World!"));

// - LISTEN : - //
// Application écoute => le port 3000
app.listen(port, () => console.log("Listening on port " + port));
