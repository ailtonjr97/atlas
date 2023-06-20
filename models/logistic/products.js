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
    receiptJsDate: {type: Date, default: Date.now},
    receiptQuantity: Number,
    receiptComment: String,
    receiptWarehouse: String,
    receiptPrice: Number
  }]
});

module.exports = mongoose.model("Product", productSchema);