//jshint esversion:6
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const axios = require("axios");
const path = require("path");
const upload = require("express-fileupload");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
dotenv.config();
const inicio = require("./routes/inicio.js");
const users = require("./routes/users.js");
const chamados = require("./routes/chamado.js");
const produtos = require("./routes/produtos.js");
const anexos = require("./routes/anexos.js");
const informacoes = require("./routes/informacoes.js");
const usersprotheus = require("./routes/usersProtheus.js");

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

//-------------------------------------------------------------------------------
app.get("/protheus/usuarios", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "Users", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        if (req.isAuthenticated()) {
          Chamado.find(function (err, chamado) {
            res.render("usuariosprotheus", {
              users: response.data.resources,
              chamado: chamado,
            });
          });
        } else {
          req.session.returnTo = req.originalUrl;
          res.redirect("/login");
        }
      });
  } catch (err) {
    return res.send(
      "Erro ao retornar lista dos usuários Protheus. Tente novamente mais tarde."
    );
  }
});

app.get("/protheus/usuarios/exclui/:userId", async (req, res, next) => {
  try {
    await axios
      .delete(process.env.APITOTVS + "Users/" + req.params.userId, {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        res.redirect("/inicio");
      });
  } catch (err) {
    return res.send("Erro ao excluir usuário");
  }
});
//-------------------------------------------------------------------------------
app.get("/protheus/produtos/atualiza", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "acdmob/products?pagesize=25000", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        let produtos = response.data.products;
        ProdutoProtheus.insertMany(produtos)
          .then((produtos) => {
            res.send(produtos);
          })
          .catch((error) => {
            res.send(error);
          });
      });
  } catch (err) {
    console.log(err);
    res.send("Deu ruim");
  }
});

app.get("/protheus/produtos/atualiza", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "acdmob/products?pagesize=25000", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        let produtos = response.data.products;
        ProdutoProtheus.insertMany(produtos)
          .then((produtos) => {
            res.send(produtos);
          })
          .catch((error) => {
            res.send(error);
          });
      });
  } catch (err) {
    console.log(err);
    res.send("Deu ruim");
  }
});

app.get("/protheus/produtos/consulta", async (req, res, next) => {
  ProdutoProtheus.find(function (err, produtos) {
    res.send(produtos);
  });
});
//------------------------------------------------------------------------------
app.listen(process.env.PORT, function () {
  console.log("Servidor Node.js operacional na porta " + process.env.PORT);
});
