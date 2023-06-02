const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/routes")(app);

const port = process.env.PORT || 4000;
app.listen(port, () => winston.info(`Listening to ${port}...`));
