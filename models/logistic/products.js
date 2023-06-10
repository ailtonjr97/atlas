const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String,
  quantity: Number,
  isActive: Boolean,
  quantity: Number,
  entries: [{
    receiptNumber: Number,
    receiptDate: String,
    receiptJsDate: Date,
    receiptQuantity: Number,
    receiptComment: String,
    receiptWarehouse: String
  }]
});

module.exports = mongoose.model("Product", productSchema);