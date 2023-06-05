const express = require("express");
const router = express.Router();
const { Listing, validateListing } = require("../models/listing");
const { Category } = require("../models/category");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const validateId = require("../middleware/mongoId-validation");
const mongoose = require('mongoose');

router.get("/", auth, async (req, res) => {
  const listings = await Listing.find();
  res.status(200).send({ success: true, data: listings });
});

router.get("/self", auth, async (req, res) => {
  const listings = await Listing.find({
    $or: [
      { "createdBy._id": mongoose.Types.ObjectId(req.user._id) },
      { "createdBy._id": req.user._id },
    ],
  });
  res.status(200).send({ success: true, data: listings });
});

router.get("/:id", [auth, validateId], async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing)
    return res
      .status(404)
      .send({ success: false, message: "Listing not found!" });

  const user = await User.findById(listing?.createdBy?._id).select(
    "-password -expoPushToken"
  );
  listing.createdBy = user;

  res.status(200).send({ success: true, data: listing });
});

router.post("/", auth, async (req, res) => {
  const { error } = validateListing(req.body);

  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }

  const user = await User.findById(req.user._id).select(
    "-password -expoPushToken"
  );

  if (!user)
    return res.status(404).send({ success: false, message: "Invalid token" });

  const categoryId = await Category.findById(req.body.categoryId);

  if (!categoryId)
    return res
      .status(404)
      .send({ success: true, message: "Category not found" });

  req.body.categoryId = new Category(categoryId);

  user.numberofListings++;
  await user.save();
  req.body.createdBy = user;

  const listing = new Listing(
    _.pick(req.body, [
      "title",
      "createdBy",
      "categoryId",
      "images",
      "price",
      "location",
      "description",
    ])
  );

  await listing.save();
  res.send({ success: true, data: listing });
});

module.exports = router;

// if (req.body.imageId) {
//   const imageId = await Image.findById(req.body.imageId);

//   if (!imageId)
//     return res.status(404).send({
//       success: false,
//       message: "Image with the given Id could not be found",
//     });

//   req.body.imageId = new Image(imageId);
// }
