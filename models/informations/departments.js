const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

module.exports = mongoose.model("Department", departmentSchema);