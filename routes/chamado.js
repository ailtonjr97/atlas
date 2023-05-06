const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Chamado = require("../models/chamado.js");
const Anexo = require("../models/anexos.js");
const User = require("../models/user.js");
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/chamadomarketing", function (req, res) {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      res.render("chamadomarketing", {
        user: req.user.realNome,
        chamado: chamado,
        logado: req.user.realNome,
      });
    })
      .sort({ _id: -1 })
      .limit(1);
  } else {
    res.redirect("/login");
  }
});

router.post("/chamadomarketing", function (req, res) {
  if (req.files) {
    let file = req.files.postImage;
    let filename = file.name;
    Chamado.countDocuments({}, function (err, count) {
      if (err) {
        console.log(err);
      } else {
        let count2 = count + 1;
        file.mv("./public/anexos/" + count2 + "-" + filename, function (err) {
          if (err) {
            res.send("Erro ao subir arquivo. Favor abrir chamado.");
          } else {
            const chamado = new Chamado({
              idChamado: count2,
              setor: req.body.setor,
              descri: req.body.descri,
              empresa: req.body.empresa,
              urgencia: req.body.urgencia,
              area: req.body.area,
              atividade: req.body.atividade,
              requisitante: req.body.requisitante,
              designado: "",
              anexoNome: count2 + "-" + filename,
              resposta: "",
              arquivado: "",
            });
            chamado.save(function (err) {
              if (err) {
              } else {
                res.redirect("/verchamadomkt");
              }
            });
          }
        });
      }
    });
  } else {
    Chamado.countDocuments({}, function (err, count) {
      if (err) {
        console.log(err);
      } else {
        let count2 = count + 1;
        const chamado = new Chamado({
          idChamado: count2,
          setor: req.body.setor,
          descri: req.body.descri,
          empresa: req.body.empresa,
          urgencia: req.body.urgencia,
          area: req.body.area,
          atividade: req.body.atividade,
          requisitante: req.body.requisitante,
          designado: "",
          anexoNome: "",
          resposta: "",
          arquivado: "",
        });
        chamado.save(function (err) {
          if (err) {
          } else {
            res.redirect("/verchamadomkt");
          }
        });
      }
    });
  }
});

router.get("/verchamadomkt", (req, res) => {
  if (req.isAuthenticated()) {
    Anexo.find({}, function (err, anexo) {
      Chamado.find(function (err, chamado) {
        User.find(function (error, user) {
          res.render("verchamadomkt", {
            anexo: anexo,
            chamado: chamado,
            user: user,
            logado: req.user.realNome,
          });
        });
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/verchamadomkt", function (req, res) {
  Chamado.updateMany(
    { _id: req.body.idChamadoPost },
    {
      $set: {
        empresa: req.body.empresa,
        urgencia: req.body.urgencia,
        area: req.body.area,
        atividade: req.body.atividade,
        designado: req.body.designado,
        resposta: req.body.resposta,
        arquivado: req.body.arquivado,
      },
    },
    {
      returnNewDocument: true,
    },
    function (error, result) {
      if (error) {
        res.send(error);
      } else {
        res.redirect("/verchamadomkt");
      }
    }
  );
});

router.post("/aprovverchamadomkt", function (req, res) {
  Chamado.updateMany(
    { _id: req.body.idChamadoPost },
    {
      $push: {
        listaAprovadores: [
          { nome: req.body.aprovador },
          { status: "Em aprovação" },
        ],
      },
    },
    {
      returnNewDocument: true,
    },
    function (error, result) {
      if (error) {
        res.send(error);
      } else {
        res.redirect("/verchamadomkt");
      }
    }
  );
});

//-------------------------------------------------------------------------------
router.get("/meuschamadosmkt", (req, res) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      User.find(function (error, user) {
        res.render("meuschamadosmkt", {
          chamado: chamado,
          user: user,
          logado: req.user.realNome,
        });
      });
    });
  } else {
    res.redirect("/login");
  }
});

//-------------------------------------------------------------------------------
router.get("/aprovChamados", (req, res) => {
  if (req.isAuthenticated()) {
    Chamado.find(function (err, chamado) {
      User.find(function (error, user) {
        res.render("aprovchamados", {
          chamado: chamado,
          user: user,
          logado: req.user.realNome,
        });
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/respostaAprovChamado", function (req, res) {
  if (req.isAuthenticated()) {
    const updatePromises = [];
    for (let i = 0; i < req.body.indiceAprov; i++) {
      updatePromises.push(
        Chamado.updateOne(
          {
            _id: req.body.idChamadoPost,
            ["listaAprovadores." + i + ".nome"]: req.user.realNome,
          },
          {
            $set: {
              ["listaAprovadores." + i]: [
                { nome: req.user.realNome },
                { status: req.body.respostaAprov },
              ],
            },
          },
          {
            returnNewDocument: true,
          }
        )
      );
    }
    Promise.all(updatePromises)
      .then((result) => res.redirect("/aprovChamados"))
      .catch((error) => res.send(error));
  } else {
    return res.redirect("/login");
  }
});

module.exports = router;
