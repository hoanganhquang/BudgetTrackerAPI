const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
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
    ref: "transactionSchema",
  },
});

const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;
