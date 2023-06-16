const mongoose = require("mongoose");

const productsMovements = new mongoose.Schema({
  id: Number,
  productCode: String,
  productName: String,
  movement: String,
  quantity: Number,
  documentDate: String,
  jsDate: {type: Date, default: Date.now},
  comment: String
});

module.exports = mongoose.model("ProductMovement", productsMovements);