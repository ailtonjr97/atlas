const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");
const UserProtheus = require("../models/usersProtheus.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/usuarios", async (req, res, next) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      UserProtheus.find(function (error, users) {
        res.render("usuariosprotheus", {
          chamado: chamado,
          users: users,
        });
      });
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/exclui/:userId", async (req, res, next) => {
  try {
    await axios
      .delete(process.env.APITOTVS + "Users/" + req.params.userId, {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        res.redirect("usersprotheus/usuarios");
      });
  } catch (err) {
    return res.send("Erro ao excluir usuário");
  }
});

router.get("/atualiza", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "users", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        UserProtheus.deleteMany({});
        let users = response.data.resources;
        UserProtheus.insertMany(users)
          .then((users) => {
            res.send(users);
          })
          .catch((error) => {
            res.send(error);
          });
      });
  } catch (err) {
    console.log(err);
    res.send("Erro ao atualizar lista de usuários Protheus.");
  }
});

module.exports = router;
