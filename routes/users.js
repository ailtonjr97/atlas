const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");
const User = require("../models/user.js");

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

router.use("/register", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.username == "admin@fibracem.com") {
      Chamado.find(function (err, chamado) {
        res.render("register", {
          user: req.user.realNome,
          chamado: chamado,
          logado: req.user.realNome,
        });
      });
    } else {
      res.send("Acesso negado");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/cadastra", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        res.send(err);
      } else {
        User.updateMany(
          { username: req.body.username },
          {
            $set: {
              realNome: req.body.realNome,
              dadosPessoais: [
                { nascimento: req.body.data },
                { cpf: req.body.cpf },
                { rg: req.body.rg },
              ],
              setor: [
                { setorId: req.body.setores },
                { setorDescri: req.body.setorDescri },
              ],
              cargo: [
                { cargoId: req.body.cargos },
                { cargoDescri: req.body.cargoDescri },
              ],
              unidade: [
                { unidadeId: req.body.unidade },
                { unidadeDescri: req.body.unidadeDescri },
              ],
            },
          },
          {
            returnNewDocument: true,
          },
          function (error, result) {
            if (error) {
              res.send("erro1");
            } else {
              passport.authenticate("local")(req, res, function () {
                res.redirect("/inicio");
              });
            }
          }
        );
      }
    }
  );
});

router.get("/ativos", function (req, res) {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      User.find(function (error, user) {
        res.render("ativos", {
          chamado: chamado,
          usuario: user,
          logado: req.user.username,
        });
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/dados/:dadosId", function (req, res) {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      User.findOne({ _id: req.params.dadosId }, function (err, usuario) {
        res.render("dados", {
          userId: usuario._id,
          username: usuario.username,
          nome: usuario.dadosPessoais[0].nome,
          data: usuario.dadosPessoais[1].nascimento,
          cpf: usuario.dadosPessoais[2].cpf,
          rg: usuario.dadosPessoais[3].rg,
          setor: usuario.setor[1].setorDescri,
          cargo: usuario.cargo[1].cargoDescri,
          unidade: usuario.unidade[1].unidadeDescri,
          chamado: chamado,
        });
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/dados", function (req, res) {
  User.updateMany(
    { username: req.body.username },
    {
      $set: {
        dadosPessoais: [
          { nome: req.body.nome },
          { nascimento: req.body.data },
          { cpf: req.body.cpf },
          { rg: req.body.rg },
        ],
        setor: [
          { setorId: req.body.setores },
          { setorDescri: req.body.setorDescri },
        ],
        cargo: [
          { cargoId: req.body.cargos },
          { cargoDescri: req.body.cargoDescri },
        ],
        unidade: [
          { unidadeId: req.body.unidade },
          { unidadeDescri: req.body.unidadeDescri },
        ],
      },
    },
    {
      returnNewDocument: true,
    },
    function (error, result) {
      if (error) {
        res.send("erro1");
      } else {
        res.redirect("/inicio");
      }
    }
  );
});

router.get("/resetarsenha/:id", function (req, res) {
  User.updateMany(
    { _id: req.params.id },
    {
      $set: {
        salt: process.env.SALT,
        hash: process.env.HASH
      },
    },
    {
      returnNewDocument: true,
    },
    function (error, result) {
      if (error) {
        res.send("erro1");
      } else {
        res.redirect("/inicio");
      }
    }
  );
});

router.use("/trocasenha", function (req, res) {
  if (req.isAuthenticated()) {
      Chamado.find(function (err, chamado) {
        res.render("trocasenha", {
          user: req.user._id,
          chamado: chamado,
        });
      });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post('/changepassword/:id', function (req, res) {
  User.findById(req.params.id, (err, user) => {
      if (err) {
          res.send(err);
      } else {
          user.changePassword(req.body.oldpassword, 
          req.body.newpassword, function (err) {
              if (err) {
                  res.send("Não foi possível trocar senha")
              } else {
                  res.redirect('/inicio')
              }
          });
      }
  });
});

//Delete usuários da página dados.
router.post("/deleteUser", function (req, res) {
  User.deleteOne({ username: req.body.username }, function (err) {
    if (err) {
      console.log(err);
      res.send("Erro ao excluir");
    } else {
      res.redirect("/ativos");
    }
  });
});

module.exports = router;
