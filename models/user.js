const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  nome: String,
  name: String,
  email: String,
  password: String,
  googleId: String,
  setor: Array,
  cargo: Array,
  dadosPessoais: Array,
  unidade: Array,
  realNome: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
