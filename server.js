//jshint esversion:6
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const upload = require("express-fileupload");
const bodyParser = require("body-parser");
dotenv.config();
const inicio = require("./routes/inicio.js");
const users = require("./routes/users.js");
const chamados = require("./routes/chamado.js");
const produtos = require("./routes/produtos.js");
const anexos = require("./routes/anexos.js");
const informacoes = require("./routes/informacoes.js");
const usersprotheus = require("./routes/usersProtheus.js");
const parametros = require("./routes/parametros.js");
const cnab = require("./routes/cnab.js");
const contratos = require("./routes/contratos.js");
const calendariocontabil = require("./routes/calendariocontabil.js");
const centrodecusto = require("./routes/centrodecusto.js");
const itemcontabil = require("./routes/itemcontabil.js");
const mrp = require("./routes/mrp.js");

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
app.use(upload());

mongoose.connect(process.env.MONGOSTRING);

app.use("/", inicio);
app.use("/users", users);
app.use("/chamados", chamados);
app.use("/produtos", produtos);
app.use("/anexos", anexos);
app.use("/informacoes", informacoes);
app.use("/usersprotheus", usersprotheus);
app.use("/parametros", parametros);
app.use("/cnab", cnab);
app.use("/contratos", contratos);
app.use("/calendariocontabil", calendariocontabil);
app.use("/centrodecusto", centrodecusto);
app.use("/itemcontabil", itemcontabil);
app.use("/mrp", mrp);

app.listen(process.env.PORT, function () {
  console.log("Servidor Node.js operacional na porta " + process.env.PORT);
});
