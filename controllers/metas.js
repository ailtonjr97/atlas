const Metas = require('../models/plastpack/plastmeta.js')
const reader = require('xlsx')

const metas = async(req, res)=>{
    if(req.isAuthenticated()){
        try {
            res.render('metas/home', {
                results: await Metas.countDocuments(),
                metas: await Metas.find()
            })
        } catch (error) {
            console.log(error)
            res.render('error')
        }
    }
}

const atualizar = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            res.render('metas/atualizar')
        } catch (error) {
            console.log(error)
            res.render('error')
        }
    }
}

const atualizarPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            // Reading our test file
            const file = reader.readFile('storage/metas/' + req.file.filename)
            
            let data = []
            
            const sheets = file.SheetNames
            
            for(let i = 0; i < sheets.length; i++)
            {
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
            }
            
            // Printing data
            console.log(data)
        } catch (error) {
            console.log(error)
            res.render('error')
        }
    }
}

module.exports = {
    metas,
    atualizar,
    atualizarPost
}