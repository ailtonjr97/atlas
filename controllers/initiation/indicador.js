const indicador = async(req, res)=>{
    res.render("indicadores/indicador")
}

const indicadorComercialVendas = async(req, res)=>{
    res.render("indicadores/indicadorComercialVendas")
}

module.exports = {
    indicador,
    indicadorComercialVendas
}