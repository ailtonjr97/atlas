const axios = require("axios")
const Clientes = require("../../models/comercial/clientes.js")

const atualizar = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True" && req.user.isAdmin == "True"){
        try {
            const [requisicao, exclui] = await Promise.all([
                axios.get(process.env.APITOTVS + 'CONSULTA_SA1/get_all?limit=20000', {auth: {username: "admin", password: process.env.SENHAPITOTVS}}),
                Clientes.deleteMany()
            ]) 
            Clientes.create(requisicao.data.objects)
            res.redirect("/comercial/clientes/consultar")
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    };
}

const consultar = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [clientes, contagem] = await Promise.all ([
                Clientes.find().sort({"nome": 1}),
                Clientes.countDocuments()
            ])
            res.render("comercial/clientes.ejs", {
                "clientes": clientes,
                "contagem": contagem,
                "admin": req.user.isAdmin
            })
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    };
}


const detalhes = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const detalhes = await Clientes.find({"_id": req.params.id})
            res.render("comercial/detalhes", {
                'detalhes': detalhes[0]
            })
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    };
}

const apiProdutosIntranet = async(req, res)=>{
    const auth = {login: process.env.LOGININTRANET, password: process.env.SENHAINTRANET}
  
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  
    if (login && password && login === auth.login && password === auth.password) {
      res.send(await Clientes.find())
    }else{
      res.send("Negado")
    }
  }

module.exports = {
    atualizar,
    consultar,
    detalhes,
    apiProdutosIntranet
}