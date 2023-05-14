const mongoose = require("mongoose");

const itemcontabilSchema = new mongoose.Schema({
  CompanyId: String,
  CompanyInternalId: String,
  Code: String,
  InternalId: String,
  Description: String,
  Class: String,
  RegisterSituation: String
});

module.exports = mongoose.model("ItemContabil", itemcontabilSchema);
