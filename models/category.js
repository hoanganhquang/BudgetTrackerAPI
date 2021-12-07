const mongoose = require("mongoose");

const Category = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 45,
    minlength: 3,
    required: [true, "Require a name"],
    unique: true,
  },
});

const Category = mongoose.model("categories", User);

module.exports = Category;
