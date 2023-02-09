// - IMPORTATION PACKAGES : - //
// Importation express => framework minimaliste basé sur node.js
const express = require("express");

// - CONTROLLERS : - //
//  Importation fonctions getSauces + createSauce + getSauceById + deleteSauce + modifySauce => locale gere le token + création sauces + gerer l'id + supprimer sauce + modifier sauce
const {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce,
} = require("../controllers/sauces");

// - MIDDLEWARE : - //
// Importation function authentificateUser => locale sert à authentifier utilisateur
const { authenticateUser } = require("../middleware/auth");
// Importation function upload => locale met l'image dans le dossier images
const { upload } = require("../middleware/multer");
const saucesRouter = express.Router();
const bodyParser = require("body-parser");

saucesRouter.use(bodyParser.json());
saucesRouter.use(authenticateUser);

// - ROUTES : - //
saucesRouter.get("/", getSauces);
// Chemin post api sauces => execute function authentifier utilisateur + upload image + creation sauce
saucesRouter.post("/", upload.single("image"), createSauce);
// Chemin get api sauces id => recupere param id + execute functions authentifier utilisateur + gerer l'id
saucesRouter.get("/:id", getSauceById);
// Chemin delete api sauces id => recupere param id + execute functions authentifier utilisateur + supprimer une sauce
saucesRouter.delete("/:id", deleteSauce);
// Chemin put api sauces id => execute function authentifier utilisateur + modifier sauce
saucesRouter.put("/:id", upload.single("image"), modifySauce);
saucesRouter.post("/:id/like", likeSauce);

// - EXPORTATION : - //
// Exportation app + express => framework minimaliste basé sur node.js
module.exports = { saucesRouter };
