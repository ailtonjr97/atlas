const mongoose = require("mongoose");

const plastmetaSchema = new mongoose.Schema({
}, {strict: false});

module.exports = mongoose.model("PlastMeta", plastmetaSchema, "plastmetas");