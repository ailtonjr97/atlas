const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");
const Parametro = require("../models/parametros.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/", async (req, res, next) => {
    if (req.isAuthenticated()) {
      Chamado.find(function (err, chamado) {
        Parametro.find(function (error, parametros) {
          res.render("parametros", {
            atualizado: 0,
            chamado: chamado,
            parametros: parametros,
          });
        }).sort({"code": 1});
      });
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  });

  router.get("/atualizada", async (req, res, next) => {
    if (req.isAuthenticated()) {
      Chamado.find(function (err, chamado) {
        Parametro.find(function (error, parametros) {
          res.render("parametros", {
            atualizado: 1,
            chamado: chamado,
            parametros: parametros,
          });
        }).sort({"code": 1});;
      });
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  });

router.get("/atualizar", async (req, res, next) => {
    try {
      await axios
        .get(process.env.APITOTVS + "api/framework/v1/systemParameters?pagesize=12000", {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        })
        .then((response) => {
            Parametro.deleteMany().then(() => {
            let parametros = response.data.items;
            Parametro.insertMany(parametros)
              .then((parametros) => {
                res.redirect("/parametros/atualizada")
              })
              .catch((error) => {
                res.send(error);
              });
          });
        });
    } catch (err) {
      Chamado.find(function (err, chamado) {
        Parametro.find(function (error, parametros) {
          res.render("parametros", {
            atualizado: 2,
            chamado: chamado,
            parametros: parametros,
          });
        });
      });
    }
  });

  router.get("/atualizarunico/:id", async (req, res, next) => {
    try {
      await axios
        .get(process.env.APITOTVS + "api/framework/v1/systemParameters/" + req.params.id, {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        })
        .then((response) => {
          Parametro.deleteOne({"systemparameterid": response.data.systemparameterid}).then(() => {
            Parametro.create(response.data).then(()=>{
              res.redirect("/parametros/atualizada");
            })
          });
        });
    } catch (err) {
      Chamado.find(function (err, chamado) {
        Parametro.find(function (error, parametros) {
          res.render("parametros", {
            atualizado: 2,
            chamado: chamado,
            parametros: parametros,
          });
        });
      });
    }
  });

  module.exports = router;