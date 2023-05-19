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

router.get("/protheus/empresasfiliais", async (req, res, next) => {
  await axios.all([axios.get(process.env.APITOTVS + "api/framework/environment/v1/companies",
        {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        }
      ),
      axios.get(process.env.APITOTVS + "api/framework/environment/v1/branches",
        {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        }
      ),
    ])
    .then(
      axios.spread((data1, data2) => {
        if (req.isAuthenticated()) {
          Chamado.find(function (err, chamado) {
            res.render("filiaisempresasprotheus", {
              empresas: data1.data.items,
              filiais: data2.data.items,
              chamado: chamado,
            });
          });
        } else {
          req.session.returnTo = req.originalUrl;
          res.redirect("/login");
        }
      })
    )
    .catch((error) => {
      return res.send(
        "Erro ao retornar lista de filiais e empresas. Tente novamente mais tarde."
      );
    });
});

router.get("/parametros", function (req, res) {
  if (req.isAuthenticated()) {
    Parametro.find(function (err, chamado) {
      res.render("parametros", {
        acessos: "",
        chamado: chamado,
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

module.exports = router;
