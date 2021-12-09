const express = require("express");
const router = express.Router();

const category = require("../controllers/category");
const auth = require("../controllers/auth");

router.use(auth.protect);

router.delete("/:id", category.deleteOne);

router.patch("/:id", category.updateOne);

router.route("/").get(category.getAll).post(category.createOne);

module.exports = router;
