const mongoose = require("mongoose");

const anexoSchema = new mongoose.Schema({
  img: {
    data: String,
    contentType: String,
  },
});

module.exports = mongoose.model("Anexo", anexoSchema);
