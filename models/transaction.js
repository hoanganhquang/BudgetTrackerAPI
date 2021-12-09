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

TransactionSchema.pre("save", async function (next) {
  const budget = await this.populate({
    path: "budget",
    select: "amount",
  });
  if (
    budget.transactionType == "expense" &&
    budget.amount > budget.budget.amount
  ) {
    return next(new Error("Not enough money in budget"));
  }
  next();
});

const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;
