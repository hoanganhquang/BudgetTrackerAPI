const mongoose = require("mongoose");

const Transaction = mongoose.Schema({
  income: {
    type: Number,
    trim: true,
  },
  expense: {
    type: Number,
    trim: true,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  notes: {
    type: String,
    trim: true,
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "budget",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
  },
});

const Transaction = mongoose.model("transaction", User);

module.exports = Transaction;
