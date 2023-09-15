const Metas = require('../models/plastpack/plastmeta.js')
const reader = require('xlsx')

const metas = async(req, res)=>{
    if(req.isAuthenticated()){
        try {
            res.render('metas/home', {
                results: await Metas.countDocuments(),
                metas: await Metas.find().sort({'id': 1})
            })
        } catch (error) {
            console.log(error)
            res.render('error')
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const atualizar = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            res.render('metas/atualizar')
        } catch (error) {
            console.log(error)
            res.render('error')
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const atualizarPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            await Metas.deleteMany()
            const file = reader.readFile('storage/metas/' + req.file.filename)
            
            let data = []
            
            const sheets = file.SheetNames
            
            for(let i = 0; i < sheets.length; i++){
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]], {raw: false})
            temp.forEach((res) => {
                data.push(res)
            })
        }
        await Metas.create(data)
        res.redirect('/metas')
        } catch (error) {
            console.log(error)
            res.render('error')
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const metasApi = async(req, res)=>{
        try {
            res.send(await Metas.find().sort({'id': 1}))
        } catch (error) {
            console.log(error)
            res.render('error')
        }
}

module.exports = {
    metas,
    atualizar,
    atualizarPost,
    metasApi
}