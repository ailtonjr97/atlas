//jshint esversion:6
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const axios = require("axios");
const findOrCreate = require("mongoose-findorcreate");
const path = require("path");
const upload = require("express-fileupload");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
dotenv.config();
const inicio = require("./routes/inicio.js");
const users = require("./routes/users.js");

const app = express();

app.set("view engine", "ejs");
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
app.use(upload());

mongoose.connect(process.env.MONGOSTRING);

const produtoSchema = new mongoose.Schema({
  nome: String,
  descri: String,
  codigo: String,
  tipo: String,
  ncm: Number,
  quantidade: Number,
  lote: Array,
  gtin: Number,
  un: String,
  grupo: String,
  utilizacao: String,
  familia: String,
  origem: String,
  nf: Number,
  anexoNome: String,
  ipi: Number,
  icms: Number,
  cofins: Number,
  qtdembalagem: Number,
  lotemin: Number,
  estoquemin: Number,
  estoquemax: Number,
  prazovalidade: Date,
});

const produtosProtheus = new mongoose.Schema({
  code: String,
  barcode: String,
  description: String,
  address: Boolean,
  batch: String,
  batchs: Array,
});

const anexoSchema = new mongoose.Schema({
  img: {
    data: String,
    contentType: String,
  },
});

const Produto = mongoose.model("Produto", produtoSchema);
const Anexo = mongoose.model("Anexo", anexoSchema);
const ProdutoProtheus = mongoose.model("ProdutoProtheus", produtosProtheus);

app.use("/", inicio);
app.use("/users", users);

//-------------------------------------------------------------------------------
app.get("/chamadomarketing", function (req, res) {
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

app.get("/public/anexos/:anexoNome", function (req, res) {
  if (req.isAuthenticated()) {
    var options = {
      root: path.join(__dirname + "\\public\\anexos"),
    };

    var fileName = req.params.anexoNome;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        res.send(err);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/public/anexos/produtos/:anexoNome", function (req, res) {
  if (req.isAuthenticated()) {
    var options = {
      root: path.join(__dirname + "\\public\\anexos\\produtos"),
    };

    var fileName = req.params.anexoNome;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        res.send(err);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/chamadomarketing", function (req, res) {
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
//-------------------------------------------------------------------------------
app.get("/verchamadomkt", (req, res) => {
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

app.post("/verchamadomkt", function (req, res) {
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

app.post("/aprovverchamadomkt", function (req, res) {
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
app.get("/meuschamadosmkt", (req, res) => {
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
app.get("/aprovChamados", (req, res) => {
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

app.post("/respostaAprovChamado", function (req, res) {
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

app.get("/testaEmail", (req, res) => {
  async function main() {
    let transporter = nodemailer.createTransport({
      host: "outlook.maiex13.com.br",
      port: 587,
      secure: false,
      auth: {
        user: "informatica04@fibracem.com",
        pass: "Fibracem@2021",
      },
    });

    let info = await transporter.sendMail({
      from: '"Ailton" informatica04@fibracem.com',
      to: "sistema@fibracem.com",
      subject: "Teste email",
      text: "Teste",
      html: "<b>Hello world?</b>",
    });
  }

  main().catch(console.error);
});

//-------------------------------------------------------------------------------
app.get("/cadastroproduto", (req, res) => {
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

app.post("/cadastroproduto", function (req, res) {
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
app.get("/produtos", (req, res) => {
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
app.post("/alteraProduto", function (req, res) {
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
app.get("/produtos/entrada/:id", (req, res) => {
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

app.post("/produtos/entrada/:id", (req, res) => {
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
//-------------------------------------------------------------------------------
app.get("/protheus/usuarios", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "Users", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        if (req.isAuthenticated()) {
          Chamado.find(function (err, chamado) {
            res.render("usuariosprotheus", {
              users: response.data.resources,
              chamado: chamado,
            });
          });
        } else {
          req.session.returnTo = req.originalUrl;
          res.redirect("/login");
        }
      });
  } catch (err) {
    return res.send(
      "Erro ao retornar lista dos usuários Protheus. Tente novamente mais tarde."
    );
  }
});

app.get("/protheus/usuarios/exclui/:userId", async (req, res, next) => {
  try {
    await axios
      .delete(process.env.APITOTVS + "Users/" + req.params.userId, {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        res.redirect("/inicio");
      });
  } catch (err) {
    return res.send("Erro ao excluir usuário");
  }
});
//-------------------------------------------------------------------------------
//Retorna lista de empresas e filiais cadastradas no Protheus Produção
app.get("/protheus/empresasfiliais", async (req, res, next) => {
  await axios
    .all([
      axios.get(
        process.env.APITOTVS + "api/framework/environment/v1/companies",
        {
          auth: {
            username: process.env.USER,
            password: process.env.SENHAPITOTVS,
          },
        }
      ),
      axios.get(
        process.env.APITOTVS + "api/framework/environment/v1/branches",
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

//------------------------------------------------------------------------------
app.get("/protheus/produtos/atualiza", async (req, res, next) => {
  try {
    await axios
      .get(process.env.APITOTVS + "acdmob/products?pagesize=25000", {
        auth: {
          username: process.env.USER,
          password: process.env.SENHAPITOTVS,
        },
      })
      .then((response) => {
        let produtos = response.data.products;
        ProdutoProtheus.insertMany(produtos)
          .then((produtos) => {
            res.send(produtos);
          })
          .catch((error) => {
            res.send(error);
          });
      });
  } catch (err) {
    console.log(err);
    res.send("Deu ruim");
  }
});

app.get("/protheus/produtos/consulta", async (req, res, next) => {
  ProdutoProtheus.find(function (err, produtos) {
    res.send(produtos);
  });
});
//------------------------------------------------------------------------------
app.listen(process.env.PORT, function () {
  console.log("Servidor Node.js operacional na porta " + process.env.PORT);
});
