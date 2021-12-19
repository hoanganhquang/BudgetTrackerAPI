const express = require("express");
const router = express.Router();

const budget = require("../controllers/budget");
const auth = require("../controllers/auth");

router.use(auth.protect);

router.delete("/:id", budget.deleteOne);

router.patch("/:id", budget.updateOne);

router.get("/:id", budget.getOne);

router.route("/").get(budget.getAll).post(budget.createOne);

module.exports = router;
