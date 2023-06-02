const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { Image } = require("../models/image");
const {
  uploadFileToDrive,
  deleteFileFromDrive,
} = require("../services/drive-upload.service");
const validateId = require("../middleware/mongoId-validation");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

router.post("/", [ upload.single("file")], async (req, res) => {
  const { file } = req;

  const response = await uploadFileToDrive(file);

  const image = new Image({
    name: response.name,
    mimeType: response.mimeType,
    key: response.id,
  });

  await image.save();
  return res.status(200).send({ success: true, data: image });
});

/*============================================================================*/

router.delete("/:id", [auth, validateId], async (req, res) => {
  const image = await Image.findByIdAndDelete(req.params.id);

  if (!image)
    return res.status(404).send({
      success: false,
      message: "Image with the given id could not be found!",
    });

  await deleteFileFromDrive(image.key);

  res.send({ success: true });
});

module.exports = router;
