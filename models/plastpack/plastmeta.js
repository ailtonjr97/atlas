const mongoose = require("mongoose");

const plastmetaSchema = new mongoose.Schema({
  id: Number,
  codcliente: String,
  codvendedor: String,
  codgrupo: String,
  codlinha: String,
  data: String,
  meta_r_c_impostos: String,
  tipo: Number,
  loja: String
});

module.exports = mongoose.model("PlastMeta", plastmetaSchema, "plastmetas");