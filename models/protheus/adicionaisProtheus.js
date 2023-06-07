const mongoose = require("mongoose");

const adicionaisProtheus = new mongoose.Schema({
  cod: String,
  ceme: String,
});

module.exports = mongoose.model("AdicionaisProtheus", adicionaisProtheus);
