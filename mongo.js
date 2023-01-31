// ------ CONNEXION A NOTRE BASE DE DONNEES MONGODB ------ //

// - IMPORTATION PACKAGES : - //
// Importation mongodb => base de données
const mongoose = require("mongoose");
// Importation mongoose-unique-validator => verifie utilisateur unique
const uniqueValidator = require("mongoose-unique-validator");

// - CONNEXION DATABASE : - //
// User name => injecte le nom utilisateur database dans l'uri
const userName = process.env.DB_USER;
// Password => injecte le mot de passe utilisateur dans l'uri
const password = process.env.DB_PASSWORD;
// Db => injecte le nom de la database dans l'uri
const db = process.env.DB_NAME;
// Uri => lien pour connecter notre serveur mongodb
const uri = `mongodb+srv://${userName}:${password}@cluster1.em6hcyp.mongodb.net/${db}?retryWrites=true&w=majority`;
// Connexion => à l'uri
mongoose
  .connect(uri)
  .then(() => console.log("Connecté à MongoDB !"))
  .catch((err) => console.error("Erreur de connexion à MongoDB !: ", err));

// - SCHEMA BASE DE DONNEES : - //
// Schema userSchema => objet création compte
const userSchema = new mongoose.Schema({
  // email => utilisateur unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Invocation uniqueValidator => plugin verifie utilisateur unique
userSchema.plugin(uniqueValidator);
// Mongoose model => nom du schéma + utilisation de userSchema
const User = mongoose.model("User", userSchema);

// - EXPORTATION : - //
// Exportation mongoose + objet user => base de données + schema utilisateur
module.exports = { mongoose, User };
