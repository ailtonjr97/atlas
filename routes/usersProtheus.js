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

router.get("/atualizar", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "users", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        UserProtheus.deleteMany().then(() => {
          let users = response.data.resources;
          UserProtheus.insertMany(users)
            .then((users) => {
              res.send(
                "Tabela atualizada com sucesso. Clique " +
                  "<a href='/usersprotheus/usuarios'>aqui</a>" +
                  " para retornar à lista de usuarios Protheus"
              );
            })
            .catch((error) => {
              res.send(error);
            });
        });
      });
  } catch (err) {
    console.log(err);
    res.send("Erro ao atualizar tabela de usuários Protheus.");
  }
});

router.get("/acessos", function (req, res) {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      res.render("acessos", {
        acessos: "",
        chamado: chamado,
      });
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/acessosprocura", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "api/framework/v1/menus?pagesize=150", {
        auth: {
          username: req.body.login,
          password: req.body.senha,
        },
      })
      .then((response) => {
        if (req.isAuthenticated()) {
          let acessos = response.data.items;
          Chamado.find(function (err, chamado) {
            res.render("acessos", {
              acessos: acessos,
              chamado: chamado,
            });
          });
        } else {
          req.session.returnTo = req.originalUrl;
          res.redirect("/login");
        }
      });
  } catch (err) {
    console.log(err);
    res.send("Erro ao retornar lista de acessos do Protheus.");
  }
});

module.exports = router;
