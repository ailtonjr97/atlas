const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const Chamado = require("../models/chamado.js");
const User = require("../models/user.js");
const Produto = require("../models/produtos.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/cadastroproduto", (req, res) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      User.find(function (error, user) {
        res.render("cadastroproduto", {
          chamado: chamado,
          user: user,
        });
      });
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/cadastroproduto", function (req, res) {
  if (req.files) {
    let file = req.files.postImage;
    let filename = file.name;
    Produto.countDocuments({}, function (err, count) {
      if (err) {
        console.log(err);
      } else {
        let count2 = count + 1;
        file.mv(
          "./public/anexos/produtos/" + count2 + "-" + filename,
          function (err) {
            if (err) {
              res.send("Erro ao subir arquivo. Favor abrir chamado.");
            } else {
              const produto = new Produto({
                nome: req.body.nome,
                descri: req.body.descri,
                codigo: req.body.codigo,
                tipo: req.body.tipo,
                ncm: req.body.ncm,
                gtin: req.body.gtin,
                grupo: req.body.grupo,
                un: req.body.un,
                utilizacao: req.body.utilizacao,
                familia: req.body.familia,
                anexoNome: count2 + "-" + filename,
                origem: req.body.familia,
                ipi: req.body.ipi,
                icms: req.body.icms,
                cofins: req.body.cofins,
                qtdembalagem: req.body.qtdembalagem,
                lotemin: req.body.lotemin,
                estoquemin: req.body.estoquemin,
                estoquemax: req.body.estoquemax,
                prazovalidade: req.body.prazovalidade,
              });
              produto.save(function (err) {
                if (err) {
                } else {
                  res.redirect("/produtos");
                }
              });
            }
          }
        );
      }
    });
  } else {
    Produto.countDocuments({}, function (err, count) {
      if (err) {
        console.log(err);
      } else {
        let count2 = count + 1;
        const produto = new Produto({
          nome: req.body.nome,
          descri: req.body.descri,
          codigo: req.body.codigo,
          tipo: req.body.tipo,
          ncm: req.body.ncm,
          gtin: req.body.gtin,
          grupo: req.body.grupo,
          un: req.body.un,
          utilizacao: req.body.utilizacao,
          familia: req.body.familia,
          origem: req.body.origem,
          anexoNome: "default-placeholder.png",
          ipi: req.body.ipi,
          icms: req.body.icms,
          cofins: req.body.cofins,
          qtdembalagem: req.body.qtdembalagem,
          lotemin: req.body.lotemin,
          estoquemin: req.body.estoquemin,
          estoquemax: req.body.estoquemax,
          prazovalidade: req.body.prazovalidade,
        });
        produto.save(function (err) {
          if (err) {
          } else {
            res.redirect("/produtos");
          }
        });
      }
    });
  }
});

//-------------------------------------------------------------------------------
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      Produto.find(function (error, produto) {
        res.render("produtos", {
          chamado: chamado,
          produtos: produto,
        });
      });
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});
//-------------------------------------------------------------------------------//
router.post("/alteraProduto", function (req, res) {
  Produto.updateMany(
    { _id: req.body.idProdutoPost },
    {
      $set: {
        descri: req.body.descri,
        codigo: req.body.codigo,
        tipo: req.body.tipo,
        ncm: req.body.ncm,
        gtin: req.body.gtin,
        grupo: req.body.grupo,
        un: req.body.un,
        utilizacao: req.body.utilizacao,
        familia: req.body.familia,
        origem: req.body.origem,
      },
    },
    {
      returnNewDocument: true,
    },
    function (error, result) {
      if (error) {
        res.send(error);
      } else {
        res.redirect("/produtos");
      }
    }
  );
});
//-------------------------------------------------------------------------------
//Entrada de produtos
router.get("/produtos/entrada/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      Produto.findOne({ _id: req.params.id }, function (err, produto) {
        res.render("entradaproduto", {
          chamado: chamado,
          nome: produto.nome,
        });
      });
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/produtos/entrada/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Produto.findByIdAndUpdate(
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
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

module.exports = router;
