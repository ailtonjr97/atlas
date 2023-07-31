const mongoose = require("mongoose");

const carriersSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String
});

module.exports = mongoose.model("Carriers", carriersSchema);