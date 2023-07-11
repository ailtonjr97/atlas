const express = require("express");
const router = express.Router();
const{consultar, atualizar, detalhes, apiProdutosIntranet} = require("../controllers/comercial/clientes.js")

router.get("/clientes/consultar", consultar);
router.get("/clientes/atualizar", atualizar);
router.get("/clientes/detalhes/:id", detalhes);
router.get("/totvs/clientes", apiProdutosIntranet);

module.exports = router;