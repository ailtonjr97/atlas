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
            function ExcelDateToJSDate(serial) {
                var utc_days  = Math.floor(serial - 25569);
                var utc_value = utc_days * 86400;                                        
                var date_info = new Date(utc_value * 1000);
             
                var fractional_day = serial - Math.floor(serial) + 0.0000001;
             
                var total_seconds = Math.floor(86400 * fractional_day);
             
                var seconds = total_seconds % 60;
             
                total_seconds -= seconds;
             
                var hours = Math.floor(total_seconds / (60 * 60));
                var minutes = Math.floor(total_seconds / 60) % 60;
             
                return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
             }
            await Metas.deleteMany()
            const file = reader.readFile('storage/metas/' + req.file.filename)
            
            let data = []
            
            const sheets = file.SheetNames
            
            for(let i = 0; i < sheets.length; i++){
            const temp = reader.utils.sheet_to_json(
                    file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        await Metas.create(data)

        data.forEach(async (datas) => {
            console.log(ExcelDateToJSDate(datas.Data))
        });


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