const mongoose = require("mongoose");

const cliente = new mongoose.Schema({
  cod: String,
  nome: String,
  cod_mun: String,
  mun: String,
  nreduz: String,
  grpven: String,
  loja: String,
  end: String,
  codpais: String,
  est: String,
  cep: String,
  tipo: String,
  cgc: String,
});

module.exports = mongoose.model("Cliente", cliente);