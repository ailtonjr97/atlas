const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(
  session({
    secret: process.env.PASSWORD,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGOSTRING);

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

const chamadoSchema = new mongoose.Schema({
  idChamado: Number,
  setor: String,
  descri: String,
  empresa: String,
  urgencia: String,
  area: String,
  atividade: String,
  impacto: String,
  designado: String,
  requisitante: String,
  designado: String,
  listaAprovadores: Array,
  anexoNome: String,
  resposta: String,
  arquivado: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
const Chamado = mongoose.model("Chamado", chamadoSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.use("/home", function (req, res) {
  res.render("home");
});

router.use("/login", function (req, res) {
  res.render("login");
});

router.use("/autentica", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      res.send("Erro");
    } else {
      passport.authenticate("local")(req, res, function () {
        if (user) {
          res.redirect(req.session.returnTo || "/inicio");
          delete req.session.returnTo;
        } else {
          res.send("Negative");
        }
      });
    }
  });
});

router.use("/inicio", function (req, res) {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      User.find(function (error, user) {
        res.render("inicio", {
          chamado: chamado,
        });
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.use("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
