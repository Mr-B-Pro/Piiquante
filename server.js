// ------ CREATION SERVEUR ------ //

// - IMPORTATION PACKAGES : - //
// Importation dotenv => masque les données sensibles
require("dotenv").config();
// Importation express => framework minimaliste basé sur node.js
const express = require("express");
// Invocation function express => framework minimaliste basé sur node.js
const app = express();
// Ecoute du port => 3000
const port = 3000;
// // Importation body-parser => interprète le JSON d’une réponse HTTP
// const bodyParser = require("body-parser");
// Importation cors => pour ajouter des headers
const cors = require("cors");
// Importation multer => pour télécharger des fichier
const multer = require("multer");
// Upload l'image dans le dossier images
const upload = multer({ dest: "images/" });
// // Importation serveStaticpour => sert les fichiers à partir d'un répertoire racine
// const serveStatic = require("serve-static");
// // Importation path => pour trouver le chemin
// const path = require("path");

// - CONNEXION DATABASE : - //
// Importation locale mongodb => base de données
require("./mongo");

// - CONTROLLERS : - //
//  Importation createUser + logUser => locale création + connexion utilisateur
const { createUser, logUser } = require("./controllers/users");
//  Importation getSauces + createSauce  => locale gere le token + création sauces
const { getSauces, createSauce } = require("./controllers/sauces");

// - MIDDLEWARE : - //
// Invocation function cors => pour ajouter des headers
app.use(cors());
// Invocation function express.json => reconnaît objet request entrant en tant qu'objet JSON
app.use(express.json());
//  Invocation function authentificateUser => locale authentifie utilisateur
const { authentificateUser } = require("./middleware/auth");

// - ROUTES : - //
// Chemin post api signup => invoque function creation utilisateur
app.post("/api/auth/signup", createUser);
// Chemin post api login => invoque function connexion utilisateur
app.post("/api/auth/login", logUser);
// Chemin get api sauces => execute functions authentifier utilisateur + gerer le token
app.get("/api/sauces", authentificateUser, getSauces);
// Chemin post api sauces => execute function authentifier utilisateur + upload image + creation sauce
app.post(
  "/api/sauces",
  authentificateUser,
  upload.single("image"),
  createSauce
);
// Chemin get absolu => execute function qui affiche hello world
app.get("/", (req, res) => res.send("Hello World!"));

// - LISTEN : - //
// Application écoute => le port 3000
app.listen(port, () => console.log("Listening on port " + port));
