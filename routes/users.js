const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");

router.post("/signin", auth.login);

router.post("/signup", auth.signup);

module.exports = router;
