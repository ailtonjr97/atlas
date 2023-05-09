const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");

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
    await axios
      .all([
        axios.get(
          process.env.APITOTVS + "valcnabati/",
          {
            auth: {
              username: process.env.USER,
              password: process.env.SENHAPITOTVS,
            },
          }
        )
      ])
      .then(
        axios.spread((data1) => {
          if (req.isAuthenticated()) {
            Chamado.find(function (err, chamado) {
              res.render("cnab", {
                cnabs: data1.data.Checkins,
                chamado: chamado,
              });
            });
          } else {
            req.session.returnTo = req.originalUrl;
            res.redirect("/login");
          }
        })
      )
      .catch(() => {
        return res.send(
          "Erro ao retornar lista de cnabs. Tente novamente mais tarde."
        );
      });
  });

  module.exports = router