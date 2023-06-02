const express = require("express");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");
const auth = require("../middleware/auth");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const category = await Category.find();
  res.send({ success: true, data: category });
});

router.post("/", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }
  let category = new Category({
    label: req.body.label,
    icon: req.body.icon,
    backgroundColor: req.body.backgroundColor,
  });

  await category.save();
  res.send({ success: true, data: category });
});

router.put("/:id", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["label", "icon", "backgroundColor"]),
    { new: true }
  );

  if (!category)
    res.status(404).send({
      success: false,
      message: "category with the given id could not be found!",
    });

  res.send({ success: true, data: category });
});

module.exports = router;
