const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
  quantity: Number,
  isActive: Boolean
});

module.exports = mongoose.model("Product", productsSchema);