const mongoose = require("mongoose");
const Joi = require("joi");
const { imageSchema } = require("./image");
const { categorySchema } = require("./category");

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    lowercase: true,
  },
  createdBy: { type: Object },
  images: {
    type: [String],
  },
  description: { type: String },
  price: { type: Number },
  categoryId: { type: categorySchema },
  location: new mongoose.Schema({
    latitude: { type: Number },
    longitude: { type: Number },
  }),
  createdAt:{type: Date, required: true, default: Date.now, }
});

const Listing = mongoose.model("Listing", listingSchema);

function validateListing(genre) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().allow(null, ''),
    categoryId: Joi.objectId().required(),
    images: Joi.array().min(1).required(),
    price: Joi.number().min(1).required(),
    location: Joi.object().keys({
      latitude: Joi.number(),
      longitude: Joi.number(),
    }),
  });

  return schema.validate(genre);
}

module.exports = { Listing, validateListing, listingSchema };
