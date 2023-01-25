// ---- server.js SERT A CREER LE SERVEUR NODE ---- //

// - IMPORTATION PACKAGE : - //

// Http => qui sera utilisé pour créer le serveur
const http = require("http");
// App => qui appel les différentes fonctions implémantées dans l'api
const app = require("./app");

// - GERER LE PORT : - //

// On dit à l'app express sur quel port elle va tourner
// normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// on utilise port 3000 par défaut, s'il n'est pas dispo on utilise la variable environnement
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// errorHandler recherche les ≠ erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// on créé une nouvelle constante dans laquelle on appelle la fonction qui sera appelée à chaque requête serveur
const server = http.createServer(app);

server.on("error", errorHandler);

// ecouteur d'évènements consigne le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// ce serveur attend les requêtes envoyées en utilisant listen
server.listen(port);
