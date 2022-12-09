const express = require("express");
const bodyParser = require("body-parser");
const RateLimit = require("express-rate-limit");
const cors = require("cors");

// Configure dot env to read environment variables from our .env file
require("dotenv").config();

// Initialize our app
const app = express();
// Expect json as our request bodies
app.use(bodyParser.json());
// Allow CORS
app.use(cors({origin: "*"}));
// Needed because Heroku is behind a reverse proxy
// app.enable("trust proxy");

// Rate limiter initialization
const limiter = new RateLimit({
  // 15 minutes
  windowMs: 15*60*1000,
  // 25 requests per windowMs per IP
  max: 1000,
  // Disable delaying - full speed until the max limit is reached
  delayMs: 0,
});

// Add rate limiter to our app
app.use(limiter);

/**
 * Root route.
 */
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

/**
 * Start our app on port 4000.
 */
// app.listen(process.env.PORT || 4000, () => {
//     console.log(`App listening on port ${process.env.PORT || 4000}!`);
// });

/**
 * Google spreadsheet routes.
 */
require("./google-sheets/routes")(app);

/**
 * Global error handlers.
 */
app.use((err, req, res, next) => {
  console.error(`Internal Server Error: ${err}`);
  res.status(500).send({status: 500, message: err,
    type: "Internal Server Error"});
});
process.on("uncaughtException", (err) => {
  console.error(`Internal Server Error: ${err}`);
});

module.exports = app;
