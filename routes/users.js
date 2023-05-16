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
        hash: "327a1694cb0fdd444d70b7e14ef745b6da24886837405b59151696ce64d626a925b14892cb9597bd4da83caeffbb8f7a73f48bcea2b4aa9538d1161f707fa97d0d514f2f3360fe264c496e6a7b73d9b441db2cfc79a3028ba99b17c3639f42e71ec7b6b76df219240d817e9c81b578e6c5acb1c909694f41100ccba2db775ffa4ad573c3c0d8243a388e7b105648748c5b1fbaaa8bbf55c3fbc12f16f3165b053f2d6c6fbfa3b99b0a4f40cd7ed8fed4881810f468904f4602c2fefe32537c144a05c530a58bb558c752194d554973eb8a64f48b579aac593ff7b36e30bb3854881617395772ae662227aa0a7f09b506304032ee7f1495981ce7c3101ab9aad7b2624ce441ff40e16e3b98eb4225b310b0c6b065b4281e130e9d935d98e81754718cf24881017bc31d90da7bc302b14936b5fa778b0ee28ff9336364c4ecff163e9371459d1fe1a8c1b64890d1cf1093b16544f068d46462f805282b77dce347f6bc59be2a8e9cf6cce66106f6edaaa8d177b72bf35d9cebb4c5cbbd989d0908b1743157f059d61cca8a334b10eec4b824fcf83d783cc3655a865d092f5724fd05ad31497d5c00096230097a1e4d6286f1ba661592cdde03b6ec47dbcf3989f9df9ea64a542a36bc7bfdf49d001e274ec94690d50478d5b180ea013324eac01c0cadd7df594689d0fc2e67ebef1811c8789b6caa4b6acb9dce50d4f4835deefe"
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
