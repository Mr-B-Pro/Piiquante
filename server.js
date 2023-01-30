// ------ CREATION SERVEUR ------//

// - IMPORTATION PACKAGE : - //
// Importation dotenv => charge les variables
require("dotenv").config();
// Importation express => framework basé sur node.js
const express = require("express");
// Application => utilise framework express
const app = express();
// Ecoute du port => 3000
const port = 3000;
// Importation cors => pour la securité des headers
const cors = require("cors");

// - CONNEXION DATABASE : - //
// Importation mongo => base de données
require("./mongo");

// - CONTROLLERS : - //
// createUser => importation modèle de création de l'utilisateur signup + login
const { createUser, logUser } = require("./controllers/users");

// - MIDDLEWARE : - //
// Exécution cors => débloque header pour que tout le monde fasse requetes
app.use(cors());
// Exécution express.json => transforme les données requête POST en JSON
app.use(express.json());

// - ROUTES : - //
// Chemin => création d'utilisateur sign up
app.post("/api/auth/signup", createUser);
// Chemin => création d'utilisateur login
app.post("/api/auth/login", logUser);
app.get("/", (req, res) => res.send("Hello World!"));

// - LISTEN : - //
// Application => écoute du port
app.listen(port, () => console.log("Listening on port " + port));
