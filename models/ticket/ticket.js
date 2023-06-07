const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  idticket: Number,
  department: String,
  description: String,
  branch: String,
  urgency: String,
  area: String,
  activity: String,
  impact: String,
  designated: String,
  requester: String,
  arrayapprovers: Array,
  anexname: String,
  response: String,
  inactive: Boolean,
});

module.exports = mongoose.model("Ticket", ticketSchema);