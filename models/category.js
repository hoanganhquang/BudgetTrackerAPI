const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 45,
    minlength: 3,
    required: [true, "Require a name"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Category = mongoose.model("categories", CategorySchema);

module.exports = Category;
