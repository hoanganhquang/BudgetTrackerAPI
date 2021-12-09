const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  transactionType: {
    type: String,
    enum: ["income", "expense"],
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
  amount: {
    type: Number,
    trim: true,
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "budget",
  },
});

const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;
