const express = require("express");
const router = express.Router();
const {
    produtosAtualizar,
    produtosConsultar,
    produtosDetalhes
    } = require('../controllers/logistica/produtos.js');

router.get("/produtos/atualizar", produtosAtualizar);
router.get("/produtos/consultar", produtosConsultar);
router.get("/produtos/detalhes/:id", produtosDetalhes);

module.exports = router;