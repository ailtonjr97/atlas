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
          atualizado: 0,
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

router.get("/atualizada", async (req, res, next) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      UserProtheus.find(function (error, users) {
        res.render("usuariosprotheus", {
          atualizado: 1,
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
        UserProtheus.deleteOne({"id": req.params.userId}).then(() => {
            res.redirect("/usersprotheus/atualizada");
        });
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
              res.redirect("/usersprotheus/atualizada")
            })
            .catch((error) => {
              res.send(error);
            });
        });
      });
  } catch (err) {
    Chamado.find(function (err, chamado) {
      UserProtheus.find(function (error, users) {
        res.render("usuariosprotheus", {
          atualizado: 2,
          chamado: chamado,
          users: users,
        });
      });
    });
  }
});

router.get("/acessos", function (req, res) {
  if (req.isAuthenticated()) {
    Chamado.find(function (error, chamado) {
      res.render("acessos", {
        msgError: false,
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
          Chamado.find(function (error, chamado) {
            res.render("acessos", {
              msgError: false,
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
    Chamado.find(function (error, chamado) {
      res.render("acessos", {
        msgError: true,
        acessos: "",
        chamado: chamado,
      });
    });
  }
});

module.exports = router;
