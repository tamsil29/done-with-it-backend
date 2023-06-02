const express = require("express");
const genres = require("../routes/genres");
const listings = require("../routes/listings");
const files = require("../routes/files");
const customers = require("../routes/customers");
const category = require("../routes/category");
const movies = require("../routes/movies");
const messages = require("../routes/messages");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/listings", listings);
  app.use("/api/files", files);
  app.use("/api/category", category);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/messages", messages);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
