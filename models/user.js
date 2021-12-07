const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 20,
    minlength: 3,
    default: "user",
  },
  email: {
    type: String,
    required: [true, "Require an email"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Must have password"],
    trim: true,
    minlength: 6,
  },
  phone: {
    type: String,
    trim: true,
    default: "empty",
  },
  dayOfBirth: {
    type: Date,
    trim: true,
  },
  image: {
    type: String,
    default: "image",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.checkPassword = async function (
  passwordInput,
  userPassword
) {
  return await bcrypt.compare(passwordInput, userPassword);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.checkChangedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
