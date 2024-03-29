const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  nome: String,
  name: String,
  username: String,
  password: String,
  branch: String,
  department: String,
  userId: Number,
  isAdmin: String,
  isActive: String,
  atlasLanguage: String,
  photoName: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
