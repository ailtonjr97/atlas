const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
  nome: String,
  descri: String,
  codigo: String,
  tipo: String,
  ncm: Number,
  quantidade: Number,
  lote: Array,
  gtin: Number,
  un: String,
  grupo: String,
  utilizacao: String,
  familia: String,
  origem: String,
  nf: Number,
  anexoNome: String,
  ipi: Number,
  icms: Number,
  cofins: Number,
  qtdembalagem: Number,
  lotemin: Number,
  estoquemin: Number,
  estoquemax: Number,
  prazovalidade: Date,
});

module.exports = mongoose.model("Produto", produtoSchema);
