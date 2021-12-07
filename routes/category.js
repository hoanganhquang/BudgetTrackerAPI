const express = require("express");
const router = express.Router();

const category = require("../controllers/category");
const auth = require("../controllers/auth");

router.use(auth.protect);

router.delete("/:id", category.deleteOne);

router.post("/new-category", category.createOne);

router.get("/", category.getAll);

module.exports = router;
