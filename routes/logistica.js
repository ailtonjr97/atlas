const express = require("express");
const router = express.Router();
const {
    produtosAtualizar,
    produtosConsultar,
    produtosDetalhes,
    apiProdutosIntranet
    } = require('../controllers/logistica/produtos.js');

router.get("/produtos/atualizar", produtosAtualizar);
router.get("/produtos/consultar", produtosConsultar);
router.get("/produtos/detalhes/:id", produtosDetalhes);
router.get("/totvs/produtos", apiProdutosIntranet);

module.exports = router;