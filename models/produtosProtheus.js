const mongoose = require("mongoose");

const produtosProtheus = new mongoose.Schema({
  filial: String,
  cod: String,
  desc: String,
  tipo: String,
  codite: String,
  um: String,
  locpad: String
});

module.exports = mongoose.model("ProdutoProtheus", produtosProtheus);
