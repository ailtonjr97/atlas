const mongoose = require("mongoose");

const produtosProtheus = new mongoose.Schema({
  code: String,
  barcode: String,
  description: String,
  address: Boolean,
  batch: String,
  batchs: Array,
});

module.exports = mongoose.model("ProdutoProtheus", produtosProtheus);
