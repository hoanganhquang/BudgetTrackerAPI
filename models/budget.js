const mongoose = require("mongoose");

const BudgetSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 45,
    minlength: 3,
    required: [true, "Require a name"],
  },
  amount: {
    type: Number,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

BudgetSchema.methods.checkAmount = function (type, amount) {
  if (type == "expense") {
    this.amount = this.amount - amount;
  } else {
    this.amount = this.amount + amount;
  }
};

BudgetSchema.methods.updateAmount = function (type, amount, oldAmount) {
  if (type == "expense") {
    this.amount = this.amount + oldAmount - amount;
  } else {
    this.amount = this.amount - oldAmount + amount;
  }
};

const Budget = mongoose.model("budget", BudgetSchema);

module.exports = Budget;
