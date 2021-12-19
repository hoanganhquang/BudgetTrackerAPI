const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { promisify } = require("util");
const Email = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = user._id;

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 200, req, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new Error("Invalid information"));
  }

  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  token = req.headers.authorization.split(" ")[1];
  // }
  // if (!token) {
  //   return next(new Error("Not logged in"));
  // }

  const user = await User.findById(token);

  // if (!user) {
  //   return next(
  //     new Error("The user belonging to this token does no longer exist")
  //   );
  // }

  // if (user.checkChangedPassword(decoded.iat)) {
  //   return next(
  //     new Error("User recently changed password! Please login again")
  //   );
  // }

  req.user = user;

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Error("Not find email"));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const token = resetToken;

    await new Email(user, token).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Error("There was error sending email"));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({ passwordResetToken: hashedToken });

  if (Date.now() > user.passwordResetExpires) {
    return next(new Error("Token expired"));
  }
  user.password = req.body.password;

  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    status: "Success",
    message: "Changed the password, login again",
  });
});
