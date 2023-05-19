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
    try {
      let resultados = await ProdutoProtheus.countDocuments();
      let chamado = await Chamado.find();
      let produtos = await ProdutoProtheus.find().sort({"cod": 1});
      res.render("produtos", {
        resultados: resultados,
        atualizado: 0,
        chamado: chamado,
        produtos: produtos,
      });
    } catch (error) {
      res.send("Erro ao retornar página web. Tente novamente mais tarde.");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/detalhes/:id", async (req, res, next) => {
  if (req.isAuthenticated()) { 
    try {
      let chamado = await Chamado.find();
      let dados = await axios.get(process.env.APITOTVS + "zWSProduto/get_id?id=" + req.params.id, {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      res.render("detalhes", {
        chamado: chamado,
        dados: dados.data,
    })
    } catch (error) {
      res.send("Erro ao retornar página web. Tente novamente mais tarde.");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/atualizada", async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      let resultados = await ProdutoProtheus.countDocuments();
      let chamado = await Chamado.find();
      let produtos = await ProdutoProtheus.find().sort({"cod": 1});
      res.render("produtos", {
        resultados: resultados,
        atualizado: 1,
        chamado: chamado,
        produtos: produtos,
      });
    } catch (error) {
      res.send("Erro ao retornar página web. Tente novamente mais tarde.");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/atualizar", async(req, res, next) => {
  if(req.isAuthenticated){
    try {
      ProdutoProtheus.deleteMany().then(async()=>{
        let apiProdutos = await axios.get(process.env.APITOTVS + "zWSProduto/get_all?limit=20000", {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        })
        await ProdutoProtheus.insertMany(apiProdutos.data.objects);
        res.redirect("/produtos/atualizada");
      })
    } catch (err) {
      let chamado = await Chamado.find();
      let produtos = await ProdutoProtheus.find();
      res.render("produtos", {
        atualizado: 2,
        chamado: chamado,
        produtos: produtos,
      });
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/atualizarunico/:id/:cod", async (req, res, next) => {
  if(req.isAuthenticated){
    try {
      ProdutoProtheus.deleteOne({"_id": req.params.id}).then(async() => {
      let apiProdutos =  await axios.get(process.env.APITOTVS + "zWSProduto/get_id?id=" + req.params.cod, {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        })
        await ProdutoProtheus.create(apiProdutos.data);
        res.redirect("/produtos/atualizada");
      })
    } catch (err) {
      let chamado = await Chamado.find();
      let produtos = await ProdutoProtheus.find();
      res.render("produtos", {
        atualizado: 2,
        chamado: chamado,
        produtos: produtos,
      });
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

module.exports = router;
