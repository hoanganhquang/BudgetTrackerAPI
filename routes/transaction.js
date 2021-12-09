const express = require("express");
const router = express.Router();

const transaction = require("../controllers/transaction");
const auth = require("../controllers/auth");

router.use(auth.protect);

router.delete("/:id", transaction.deleteOne);

router.patch("/:id", transaction.updateOne);

router.post("/new-transaction", transaction.createOne);

router.get("/", transaction.getAll);

module.exports = router;
