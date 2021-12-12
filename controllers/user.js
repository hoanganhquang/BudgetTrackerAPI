const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}.jpeg`;

  sharp(req.file.buffer)
    .resize(128, 128)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/uploads/${req.file.filename}`);

  next();
};

exports.getMe = catchAsync(async (req, res) => {
  const data = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.updateMe = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.filename;
  }
  const data = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data,
  });
});
