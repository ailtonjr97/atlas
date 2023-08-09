const indicador = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const[languages] = await Promise.all([
                req.user.atlasLanguage
            ])
            res.render("indicadores/indicador",{
                languages: languages
            })
        } catch (error) {
            console.log(error)
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const indicadorComercialVendas = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const[languages] = await Promise.all([
                req.user.atlasLanguage
            ])
            res.render("indicadores/indicadorComercialVendas",{
                languages: languages
            })
        } catch (error) {
            console.log(error)
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

module.exports = {
    indicador,
    indicadorComercialVendas
}