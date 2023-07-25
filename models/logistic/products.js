const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
});

module.exports = mongoose.model("Products", productsSchema);