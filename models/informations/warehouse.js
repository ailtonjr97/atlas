const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  branch: String
});

module.exports = mongoose.model("Warehouse", warehouseSchema);