// ------ CREATION SERVEUR ------//

// - IMPORTATION PACKAGE : - //
// Importation d'express => framework basé sur node.js
const express = require("express");
// Application => utilise le framework express
const app = express();
// Ecoute du port => 3000
const port = 3000;
// Importation cors => pour la securité des headers
const cors = require("cors");

// - CONNEXION DATABASE : - //
// Importation mongo => base de données
require("./mongo");

// - CONTROLLERS : - //
// createUser => importation modèle de création de l'utilisateur
const { createUser } = require("./controllers/users");

// - MIDDLEWARE : - //
// Exécution cors => débloque header pour que tout le monde fasse requetes
app.use(cors());
// Exécution express.json => transforme les données requête POST en JSON
app.use(express.json());

// - ROUTES : - //
// Chemin => création d'utilisateur
app.post("/api/auth/signup", createUser);
app.get("/", (req, res) => res.send("Hello World!"));

// - LISTEN : - //
// Application => écoute du port
app.listen(port, () => console.log("Listening on port " + port));
