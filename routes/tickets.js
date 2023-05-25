const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Ticket = require("../models/ticket.js");
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

router.get("/", (req, res) => {
  if (req.isAuthenticated()){

  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/newticket", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      res.render("ticket")
    } catch (error) {
      res.send("Error. Try again later")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

router.post("/newticket", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      let ticketid = await Ticket.find().countDocuments;
      const ticket = new Ticket({
        idticket: ticketid,
        department: req.body.department,
        description: req.body.description,
        branch: req.body.branch,
        urgency: req.body.urgency,
        requester: req.user.dadosPessoais[0].nome,
        designated: "",
        response: "",
        inactive: false,
      });
      await Ticket.create(ticket);
      res.redirect("/tickets")
    } catch (error) {
      res.send("Error. Try again later.")
    }
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
