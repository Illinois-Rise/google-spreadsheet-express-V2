const functions = require("firebase-functions");
const server = require("./app");
// Takes our app.js and turns it into a Firebase Function
exports.app = functions.https.onRequest(server);
