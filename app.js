// ---- app.js FAIT APPEL AUX DIFFERENTES FONCTIONS IMPLEMENTEES DANS l'API : ACCES AUX IMAGES, AUX ROUTES USER, AUX ROUTES SAUCES ---- //

// - IMPORT DES MODULES NPM - AJOUT DES PLUGINS EXTERNES : - //

// EXPRESS :
// Importation d'express, framework basé sur node.js :
const express = require("express");
// création d'une application express => l'application utilise le framework express
const app = express();
// pour gérer la demande POST provenant de l'application front-end => nous devrons être capables d'extraire l'objet JSON de la demande.
app.use(express.json());
// MONGOOSE :
// On importe Mongoose pour pouvoir utiliser la base de données :
// plugin Mongoose => pour se connecter à la data base Mongo Db
const mongoose = require("mongoose");
// mot de passe Mongoose => pour se connecter à la data base Mongo Db
const password = "FMDP";

// - DECLARATION DES ROUTES : - //

// Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le mot de passe => l'un des avantages que nous avons à utiliser Mongoose pour gérer notre base de données MongoDB est que nous pouvons implémenter des schémas de données stricts qui permettent de rendre notre application plus robuste :
mongoose
  .connect(
    `mongodb+srv://Mr-B:${password}@cluster0.5igtwai.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//  - MIDDLEWARE : - //

// Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur :
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// - RENDRE LA REQUETE EXPLOITABLE : - //

// Export de l'application express pour déclaration dans server.js :
module.exports = app;
