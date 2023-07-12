const mongoose = require("mongoose");

const pedidosDeVenda = new mongoose.Schema({
    nota: String,
    tpfrete: String,
    condpag: String,
    tipocli: String,
    blq: String,
    liberok: String,
    lojacli: String,
    vend1: String,
    cliente: String,
    tipo: String,
    num: String,
    emissao: String
});

module.exports = mongoose.model("PedidosDeVenda", pedidosDeVenda);