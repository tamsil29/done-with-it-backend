const express = require("express");
const listings = require("../routes/listings");
const files = require("../routes/files");
const category = require("../routes/category");
const messages = require("../routes/messages");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/listings", listings);
  app.use("/api/files", files);
  app.use("/api/category", category);
  app.use("/api/messages", messages);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
