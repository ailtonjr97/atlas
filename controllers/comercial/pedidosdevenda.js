const axios = require("axios")
const PedidosDeVenda = require("../../models/comercial/pedidosdevenda.js")

const atualizarPv = async(req, res)=>{
    try {
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SC5/get_all?limit=1", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
        const [api, deletar] = await Promise.all([
            axios.get(process.env.APITOTVS + "CONSULTA_SC5/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}}),
            PedidosDeVenda.deleteMany({})
        ])
        PedidosDeVenda.create(api.data.objects)
        res.send("feito")
    } catch (error) {
        res.render("error.ejs")
    }
}

const consultarPv = async(req, res)=>{
    res.send("consulta")
}

module.exports = {
    atualizarPv,
    consultarPv
}