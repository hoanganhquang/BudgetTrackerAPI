const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const handle = require("./handleFactory");

exports.getAll = handle.getAll(Category);

exports.createOne = handle.createOne(Category);

exports.deleteOne = handle.deleteOne(Category);
