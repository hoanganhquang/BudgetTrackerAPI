const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res) => {
  const data = await Category.find({
    user: req.user,
  }).select("-user");

  res.status(200).json({
    status: "Success",
    length: data.length,
    data,
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  req.body.user = req.user;
  await Category.create(req.body);

  res.status(200).json({
    status: "success",
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const data = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-user");

  res.status(200).json({
    status: "success",
    data: data,
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });

  res.status(200).json({
    status: "success",
  });
});
