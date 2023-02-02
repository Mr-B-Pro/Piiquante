// ------ GESTION TOKEN + CREATION SAUCES ------ //

// - IMPORTATION PACKAGES : - //
// Importation mongodb => base de données
const mongoose = require("mongoose");

// - SCHEMA CREATION SAUCE : - //
// Schema productSchema => objet création sauce
const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});
// Mongoose model => nom du schéma + utilisation de productSchema
const Product = mongoose.model("Product", productSchema);

// - GERER LE TOKEN : - //
// Function getSauces => sert à gerer le token
function getSauces(req, res) {
  console.log("Le token à été validé, nous sommes dans getSauces !");
  // si token est ok => invocation function find
  Product.find({}).then((products) => res.send(products));
}

// - CREATION SAUCE : - //
// Function createSauce => sert à créer une sauce
function createSauce(req, res) {
  const body = req.body;
  const file = req.file;
  console.log({ body, file });

  // product => objet creation sauce
  const product = new Product({
    userId: "userId",
    name: "name",
    manufacturer: "manufacturer",
    description: "description",
    mainPepper: "mainPepper",
    imageUrl: "imageUrl",
    heat: "heat",
    likes: 0,
    dislikes: 0,
    usersLiked: ["usersLiked"],
    usersDisliked: ["usersDisliked"],
  });
  // sauvegarde => creation sauce
  product
    .save()
    .then((res) => console.log("Produit enregistré ! ", res))
    .catch(console.error);
}

// - EXPORTATION : - //
// Exportation getSauces + createSauce => gerer token + creation sauce
module.exports = { getSauces, createSauce };
