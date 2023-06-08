const mongoose = require("mongoose");

const produtosProtheus = new mongoose.Schema({
  filial: String,
  cod: String,
  desc: String,
  tipo: String,
  codite: String,
  um: String,
  locpad: String,
  grupo: String,
  te: String,
  ts: String,
  segum: String,
  conv: Number,
  tipconv: String,
  alter: String,
  prv1: Number,
  custd: Number,
  ucalstd: String,
  uprc: Number,
  mcustd: String,
  ucom: String,
  peso: Number,
  pesbru: Number,
  conta: String,
  cc: String,
  itemcc: String,
  familia: String,
  proc: String,
  lojproc: String,
  qb: Number,
  apropri: String,
  fantasm: String,
  urev: String,
  datref: String,
  rastro: String,
  foraest: String,
  comis: Number,
  dtrefp1: String,
  perinv: Number,
  conini: String,
  codbar: String,
  formlot: String,
  codgtin: String,
  localiz: String,
  opc: String,
  import: String,
  solicit: String,
  agregcu: String,
  grupcom: String,
  revatu: String,
  qtdser: String,
  clvl: String,
  cpotenc: String,
  potenci: Number,
  usafefo: String,
  msblql: String,
  x_famil: String,
  x_subfa: String,
  x_linha: String,
  xintcrm: String,
  xobs: String,
  xcodfib: String,
  xcodant: String,
  garant: String,
});

module.exports = mongoose.model("ProdutoProtheus", produtosProtheus);