const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: String,
  id: Number,
  address: String,
  city: String,
  country: String,
  zipcode: Number,
  active: String
});

module.exports = mongoose.model("Branch", branchSchema);
