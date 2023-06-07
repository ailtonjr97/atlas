const mongoose = require("mongoose");

const userProtheusSchema = new mongoose.Schema({
  id: String,
  name: Array,
  userName: String,
  displayName: String,
  meta: Array,
  externalId: String,
  phoneNumbers: Array,
  emails: Array,
  active: Boolean,
  groups: Array,
  roles: Array,
  title: String,
  department: String,
});

module.exports = mongoose.model("UserProtheus", userProtheusSchema);
