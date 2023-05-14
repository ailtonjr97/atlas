const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");
const ItemContabil = require("../models/itemcontabil.js");

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
        ItemContabil.find(function (error, itemcontabeis) {
        res.render("itemcontabil", {
          atualizado: 0,
          chamado: chamado,
          itemcontabeis: itemcontabeis,
        });
      }).sort({"Code": 1});
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/atualizada", async (req, res, next) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
        ItemContabil.find(function (error, itemcontabeis) {
        res.render("itemcontabil", {
          atualizado: 1,
          chamado: chamado,
          itemcontabeis: itemcontabeis,
        });
      }).sort({"Code": 1});;
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/atualizar", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "api/ctb/v1/AccountingItems/?pagesize=20000", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        ItemContabil.deleteMany().then(() => {
          let itemcontabeis = response.data.items;
          ItemContabil.insertMany(itemcontabeis)
            .then(() => {
              res.redirect("/itemcontabil/atualizada")
            })
            .catch((error) => {
              res.send(error);
            });
        });
      });
  } catch (err) {
    Chamado.find(function (err, chamado) {
        ItemContabil.find(function (error, itemcontabeis) {
        res.render("itemcontabil", {
          atualizado: 2,
          chamado: chamado,
          itemcontabeis: itemcontabeis,
        });
      });
    });
  }
});

router.get("/atualizarunico/:id", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "api/ctb/v1/AccountingItems/" + req.params.id, {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        ItemContabil.deleteOne({"InternalId": response.data.InternalId}).then(() => {
            ItemContabil.create(response.data).then(()=>{
            res.redirect("/itemcontabil/atualizada");
          })
        });
      });
  } catch (err) {
    Chamado.find(function (err, chamado) {
        ItemContabil.find(function (error, itemcontabeis) {
        res.render("itemcontabil", {
          atualizado: 2,
          chamado: chamado,
          itemcontabeis: itemcontabeis,
        });
      });
    });
  }
});

module.exports = router;
