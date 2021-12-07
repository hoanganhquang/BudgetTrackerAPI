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
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Budget = mongoose.model("budgetSchema", BudgetSchema);

module.exports = Budget;
