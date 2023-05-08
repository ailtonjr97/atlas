const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");
const ProdutoProtheus = require("../models/produtosProtheus.js");

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
      ProdutoProtheus.find(function (error, produtos) {
        res.render("produtos", {
          atualizado: 0,
          chamado: chamado,
          produtos: produtos,
        });
      });
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/atualizar", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "ACDMOB/products/?pagesize=21000", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        ProdutoProtheus.deleteMany().then(() => {
          let produtos = response.data.products;
          ProdutoProtheus.insertMany(produtos)
            .then(() => {
              Chamado.find(function (error, chamado) {
                res.render("produtos", {
                  atualizado: 1,
                  chamado: chamado,
                  produtos: produtos,
                });
              });
            })
            .catch((error) => {
              res.send(error);
            });
        });
      });
  } catch (err) {
    console.log(err);
    Chamado.find(function (error, chamado) {
      res.render("produtos", {
        atualizado: 2,
        chamado: chamado,
        produtos: produtos,
      });
    });
  }
});

module.exports = router;
