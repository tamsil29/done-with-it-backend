const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
    default: "https://drive.google.com/uc?id=",
  },
  key: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model("Image", imageSchema);

exports.Image = Image;
exports.imageSchema = imageSchema;
