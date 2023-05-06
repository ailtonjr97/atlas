const mongoose = require("mongoose");

const chamadoSchema = new mongoose.Schema({
  idChamado: Number,
  setor: String,
  descri: String,
  empresa: String,
  urgencia: String,
  area: String,
  atividade: String,
  impacto: String,
  designado: String,
  requisitante: String,
  designado: String,
  listaAprovadores: Array,
  anexoNome: String,
  resposta: String,
  arquivado: String,
});

module.exports = mongoose.model("Chamado", chamadoSchema);
