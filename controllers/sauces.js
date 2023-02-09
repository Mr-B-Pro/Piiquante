// ------ GESTION TOKEN + CREATION SAUCES ------ //

// - IMPORTATION PACKAGES : - //
// Importation mongodb => base de données
const mongoose = require("mongoose");
// Importation File System => gere les fichiers dans Node
const { unlink } = require("fs/promises");
// Importation likeSauce => gere les likes
// const { likeSauce } = require("./vote");

// - SCHEMA CREATION SAUCE : - //
// Schema productSchema => objet création sauce
const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: { type: Number, min: 1, max: 5 },
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});
// Mongoose model => nom du schéma + utilisation de productSchema
const Product = mongoose.model("Product", productSchema);
mongoose.set("strictQuery", false);

// - GERER LE TOKEN : - //
// Function getSauces => sert à gerer le token
function getSauces(req, res) {
  // si token est ok invocation function find sur le schema Product => pour trouver des données particulières dans MongoDB
  Product.find({})
    .then((products) => res.send(products))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((error) => res.status(500).send(error));
}

// - GERER L'ID : - //
// Function getSauce => sert à gerer l'id
function getSauce(req, res) {
  // id => recupere params id dans l'url
  const { id } = req.params;
  // invocation function findById sur le schema Product => recherche un seul document par son id
  return Product.findById(id);
}

// Function getSauceById => sert à gerer l'id
function getSauceById(req, res) {
  // invocation function getSauce =>
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((err) => res.status(500).send(err));
}

// - SUPPRIMER UNE SAUCE : - //
// Function deleteSauce => sert à supprimer une sauce
function deleteSauce(req, res) {
  // id => recupere params id dans l'url
  const { id } = req.params;
  // invocation function findByIdAndDelete sur le schema Product => supprime la sauce correspondant à l'id
  Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    // invocation function deleteImage => supprime image du server
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((err) => res.status(500).send({ message: err }));
}

// - MODIFIER SAUCE : - //
// Function modifySauce => sert à modifier une sauce
function modifySauce(req, res) {
  // recupere dans params l'id de l'url de la requete
  const {
    params: { id },
  } = req;
  // hasNewImage => si image true sinon false
  const hasNewImage = req.file != null;
  //  invocation function makePayload => qui gere le payload avec ou sans l'image
  const payload = makePayload(hasNewImage, req);

  // invocation function findByIdAndUpdate sur le schema Product => modifie la sauce correspondant à l'id + les élements du body
  Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    // invocation function deleteImage => supprime image du server
    .then((product) => deleteImage(product))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => console.error("PROBLEM UPDATING", err));
}

// - SUPPRIMER IMAGE : - //
// Function deleteImage => sert à supprime image du server
function deleteImage(product) {
  if (product == null) return;
  console.log("DELETE IMAGE", product);
  // imageToDelete  => recupere l'url de l'image + split donc separe elements entre / + recupere le dernier element avec -1
  const imageToDelete = product.imageUrl.split("/").at(-1);
  // fs unlink => supprimer le contenu du dossier images grâce à l'url de l'image
  return unlink("images/" + imageToDelete);
}

// - GERER PAYLOAD AVEC OU SANS L'IMAGE : - //
// Function makePayload => sert à gerer le payload avec ou sans l'image
function makePayload(hasNewImage, req) {
  console.log("hasNewImage:", hasNewImage);
  // si il y a pas d'image => recupere les données du body de la requete
  if (!hasNewImage) return req.body;
  // si il y a une image =>
  // JSON.parse => transforme données sauce qui est en string en un objet
  const payload = JSON.parse(req.body.sauce);
  // invocation fonction makeImageUrl => lien absolu dans l'url pour l'image
  payload.imageUrl = makeImageUrl(req, req.file.fileName);
  console.log("NOUVELLE IMAGE A GERER");
  console.log("voici le payload:", payload);
  return payload;
}

// - GERER ENVOI SAUCE MODIFIEE AU CLIENT : - //
// Function sendClientResponse => sert à gerer l'envoi d'une sauce modifiée au client
function sendClientResponse(product, res) {
  // si modification sauce pas ok => status 404 le serveur ne trouve pas la ressource demandée
  if (product == null) {
    console.log("NOTHING TO UPDATE");
    return res.status(404).send({ message: "Object not found in database" });
  }
  // si modification sauce ok => status 200 réussite requête
  console.log("ALL GOOD, UPDATING:", product);
  return Promise.resolve(res.status(200).send(product)).then(() => product);
}

// fonction makeImageUrl => lien absolu dans l'url pour l'image
function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
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
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

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
    // status 201 => ressource crée
    .then((message) => res.status(201).send({ message }))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((err) => res.status(500).send(err));
}

// - GESTION DES LIKES SUR LES SAUCE: - //
// Function likeSauce => sert à gerer le likes
function likeSauce(req, res) {
  // like + userId  => recupere les données du like + du userId de la requete sur le body
  const { like, userId } = req.body;
  // si like n'est pas égal à 1, -1 ou 0 => renvoi status 403 serveur comprend requête mais refuse d'autoriser
  // la méthode includes permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, sinon false
  if (![1, -1, 0].includes(like))
    return res.status(403).send({ message: "Invalid like value" });

  // si like est égal à 1, -1 ou 0
  // invocation function getSauce => sert à gerer l'id
  getSauce(req, res)
    // invocation function updateVote => mettre à jour le vote
    .then((product) => updateVote(product, like, userId, res))
    // save => sauvegarde le résultat
    .then((pr) => pr.save())
    // invocation function sendClientResponse => sert à gerer l'envoi d'une sauce modifiée au client
    .then((prod) => sendClientResponse(prod, res))
    // status 500 => serveur rencontre un problème qui l'empêche de répondre à la requête
    .catch((err) => res.status(500).send(err));
}

// Function updateVote => mettre à jour le vote
function updateVote(product, like, userId, res) {
  // si like est égal à 1 ou -1 => invocation function incrementVote
  if (like === 1 || like === -1) return incrementVote(product, userId, like);
  // renvoi invocation function resetVote =>
  return resetVote(product, userId, res);
}

// Function resetVote =>
function resetVote(product, userId, res) {
  // usersLiked + usersDisliked  => recupere les données du like dans le product
  const { usersLiked, usersDisliked } = product;
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("User seems to have voted both ways");

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject("User seems to not have voted");

  if (usersLiked.includes(userId)) {
    --product.likes;
    product.usersLiked = product.usersLiked.filter((id) => id !== userId);
  } else {
    --product.dislikes;
    product.usersDisliked = product.usersDisliked.filter((id) => id !== userId);
  }

  return product;
}

// Function incrementVote =>
function incrementVote(product, userId, like) {
  // usersLiked + usersDisliked  => recupere les données du like dans le product
  const { usersLiked, usersDisliked } = product;
  // votersArray => si usersLiked like 1 sinon usersDisliked like 1
  // opérateur (ternaire) conditionnel ? sert de raccourci pour if else
  const votersArray = like === 1 ? usersLiked : usersDisliked;
  // si userId est égal like ou dislike => renvoi product
  // la méthode includes permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, sinon false
  if (votersArray.includes(userId)) return product;
  // push le like ou le dislike du userId dans le usersLiked ou le usersDisliked
  // la méthode push ajoute un ou plusieurs éléments à la fin d'un tableau et retourne la nouvelle taille du tableau.
  votersArray.push(userId);
  // si product.likes like 1 sinon product.dislikes like 1
  // opérateur (ternaire) conditionnel ? sert de raccourci pour if else
  like === 1 ? ++product.likes : ++product.dislikes;
  return product;
}

// - EXPORTATION : - //
// Exportation getSauces + createSauce + getSauceById + deleteSauce + modifySauce  => gerer token + creation sauce + gerer l'id + supprimer sauce + modifier la sauce
module.exports = {
  sendClientResponse,
  getSauce,
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce,
};
