const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  code: String,
  description: String,
  branch: String,
  products: [{
    name: String,
    code: String,
    quantity: Number
  }]
});

module.exports = mongoose.model("Warehouse", warehouseSchema);