const Budget = require("../models/budget");
const Transaction = require("../models/transaction");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res) => {
  const budget = await Budget.findOne({
    user: req.user,
    _id: req.params.id,
  });

  const data = await Transaction.find({
    budget: budget,
  })
    .populate({ path: "budget", select: "name" })
    .populate({ path: "category", select: "name" });

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

exports.statistics = catchAsync(async (req, res) => {
  const date = req.query.date;

  const statistics = await Budget.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "budget",
        as: "transactions",
      },
    },
    {
      $project: {
        _id: 0,
        transactions: 1,
      },
    },
    {
      $unwind: "$transactions",
    },
    {
      $addFields: {
        "transactions.year": { $year: "$transactions.time" },
        "transactions.month": { $month: "$transactions.time" },
      },
    },
    {
      $match: {
        "transactions.month": new Date(date).getMonth() + 1,
        "transactions.year": new Date(date).getFullYear(),
      },
    },
    { $replaceRoot: { newRoot: "$transactions" } },
    {
      $group: {
        _id: "$transactionType",
        total: { $sum: "$amount" },
        transList: { $push: "$$ROOT" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: statistics,
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  await Transaction.deleteMany();

  res.status(200).json({
    status: "success",
  });
});
