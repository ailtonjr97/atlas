const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String,
  quantity: Number,
  isActive: Boolean
});

module.exports = mongoose.model("Product", productSchema);