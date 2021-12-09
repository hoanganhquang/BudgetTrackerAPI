const Budget = require("../models/budget");
const Transaction = require("../models/transaction");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res) => {
  console.log(req.user);
  const data = await Transaction.find({
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
  const trans = await Transaction.create(req.body);
  const budget = await Budget.findOne(trans.budget);
  budget.checkAmount(trans.transactionType, trans.amount);
  await budget.save();

  res.status(200).json({
    status: "success",
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const data = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: data,
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });

  res.status(200).json({
    status: "success",
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Transaction.deleteMany();

  res.status(200).json({
    status: "success",
  });
});
