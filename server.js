// ------ CREATION SERVEUR ------ //

// - IMPORTATION PACKAGES : - //
// Importation app => locale framework minimaliste basé sur node.js
const { app, express } = require("./app");
// Ecoute du port => 3000
const port = 3000;
// Importation path => pour trouver le chemin
const path = require("path");

// - CONNEXION DATABASE : - //
// Importation locale mongodb => base de données
require("./mongo");

// - CONTROLLERS : - //
//  Importation fonctions createUser + logUser => locale création + connexion utilisateur
const { createUser, logUser } = require("./controllers/users");
//  Importation fonctions getSauces + createSauce  => locale gere le token + création sauces
const { getSauces, createSauce } = require("./controllers/sauces");

// - MIDDLEWARE : - //
// Importation function upload => locale met l'image dans le dossier images
const { upload } = require("./middleware/multer");
// Importation function authentificateUser => locale sert à authentifier utilisateur
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
// Invocation function express.static + path.join __dirname => pour que le chemin soit compatible avec tout les systeme d'exploitation + envoi les images
app.use("/images", express.static(path.join(__dirname, "images")));
// Application écoute => le port 3000
app.listen(port, () => console.log("Listening on port " + port));
