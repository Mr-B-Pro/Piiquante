// ------ CONNEXION A NOTRE BASE DE DONNEES MONGODB ------//

// - CONNEXION DATABASE : - //
// Importation mongo => base de données
const mongoose = require("mongoose");

// - CONNEXION SERVER : - //
// Password => injecter password dans l'uri
const password = "";
// Uri => connecter notre application
const uri = `mongodb+srv://Mr-B:${password}@cluster1.em6hcyp.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo: ", err));

// Schema utilisateur
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// - EXPORTATION : - //
// mongoose, user => exportation base de données et modèle utilisateur
module.exports = { mongoose, User };
