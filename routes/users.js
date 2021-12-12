const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");
const user = require("../controllers/user");

router.post("/forgotPassword", auth.forgotPassword);

router.patch("/resetPassword", auth.resetPassword);

router.post("/signin", auth.signin);

router.post("/signup", auth.signup);

router.use(auth.protect);

router
  .route("/")
  .get(user.getMe)
  .patch(user.uploadUserPhoto, user.resizeUserPhoto, user.updateMe);

module.exports = router;
