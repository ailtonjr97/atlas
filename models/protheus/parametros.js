const mongoose = require("mongoose");

const parametroSchema = new mongoose.Schema({
  systemparameterid: String,
  branchid: String,
  type: String,
  code: String,
  description: Array,
  value: Array
});

module.exports = mongoose.model("Parametro", parametroSchema);
