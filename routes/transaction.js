const express = require("express");
const router = express.Router();

const transaction = require("../controllers/transaction");
const auth = require("../controllers/auth");

router.use(auth.protect);

router.delete("/all", transaction.deleteAll);

router.get("/statistics", transaction.statistics);

router.delete("/:id", transaction.deleteOne);

router.patch("/:id", transaction.updateOne);

router.route("/").get(transaction.getAll).post(transaction.createOne);

module.exports = router;
