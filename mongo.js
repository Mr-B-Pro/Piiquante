// ------ CONNEXION A NOTRE BASE DE DONNEES MONGODB ------//

// - CONNEXION DATABASE : - //
// Importation mongo => base de données
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// - CONNEXION SERVER : - //
// User name => injecter le user name dans l'uri
const userName = process.env.DB_USER;
// Password => injecter password dans l'uri
const password = process.env.DB_PASSWORD;
// // Db => injecter nom database dans l'uri
const db = process.env.DB_NAME;
// Uri => connecter notre application
const uri = `mongodb+srv://${userName}:${password}@cluster1.em6hcyp.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo: ", err));

// Schema utilisateur
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

// - EXPORTATION : - //
// mongoose, user => exportation base de données et modèle utilisateur
module.exports = { mongoose, User };
