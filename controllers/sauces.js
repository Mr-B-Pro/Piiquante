// ------ GESTION TOKEN + CREATION SAUCES ------ //

// - IMPORTATION PACKAGES : - //
// Importation mongodb => base de données
const mongoose = require("mongoose");
// Importation File System => gere les fichiers dans Node
const unlink = require("fs").promises.unlink;

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
  // si token est ok => invocation function find sur le schema Product
  Product.find({})
    .then((products) => res.send(products))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((error) => res.status(500).send(error));
}

// - GERER L'ID : - //
// Function getSauceById => sert à gerer l'id
function getSauceById(req, res) {
  // id => recupere params id dans l'url
  const { id } = req.params;
  // invocation function findById sur le schema Product => recherche un seul document par son id
  Product.findById(id)
    .then((product) => res.send(product))
    .catch(console.error);
}

// - SUPPRIMER UNE SAUCE : - //
// Function deleteSauce => sert à supprimer une sauce
function deleteSauce(req, res) {
  // id => recupere params id dans l'url
  const { id } = req.params;
  // invocation function findByIdAndDelete sur le schema Product => supprime l'id
  Product.findByIdAndDelete(id)
    // invocation function deleteImage => supprime image du server
    .then(deleteImage)
    .then((product) => res.send({ message: product }))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((err) => res.status(500).send({ message: err }));
}

// - SUPPRIMER IMAGE : - //
// Function deleteImage => sert à supprime image du server
function deleteImage(product) {
  // imageUrl  => recupere l'url de l'image
  const { imageUrl } = product;
  // fileToDelete  => recupere l'url de l'image + split donc separe elements entre / + recupere le dernier element avec -1
  const fileToDelete = imageUrl.split("/").at(-1);
  // fs unlink => supprimer le contenu du dossier images grâce à l'url de l'image
  return unlink(`images/${fileToDelete}`).then(() => product);
}

// - CREATION SAUCE : - //
// Function createSauce => sert à créer une sauce
function createSauce(req, res) {
  // body + file  => recupere les données du body + données de l'image de la requete
  const { body, file } = req;
  // fileName  => recupere les données du nom de l'image
  const { fileName } = file;
  // JSON.parse => transforme données sauce qui est en string en un objet
  const sauce = JSON.parse(body.sauce);
  // variables => recupere les données de l'objet sauce sur les élements du product
  const { userId, name, manufacturer, description, mainPepper, heat } = sauce;

  // fonction makeImageUrl => lien absolu dans l'url pour l'image
  function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName;
  }

  // product => objet creation sauce
  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  // sauvegarde => creation sauce
  product
    .save()
    .then((message) => {
      // status 201 => ressource crée
      res.status(201).send({ message: message });
      return console.log("Produit enregistré ! ", message);
    })
    .catch(console.error);
}

// - EXPORTATION : - //
// Exportation getSauces + createSauce + getSauceById + deleteSauce  => gerer token + creation sauce + gerer l'id + supprimer sauce
module.exports = { getSauces, createSauce, getSauceById, deleteSauce };
