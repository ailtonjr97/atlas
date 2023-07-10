const mongoose = require("mongoose");

const produto = new mongoose.Schema({
  cod: String,
  tipo: String,
  um: String,
  grupo: String,
  peso: Number,
  urev: String,
  desc: String,
  pesbru: Number
});

module.exports = mongoose.model("Produto", produto);