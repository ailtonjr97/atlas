const Warehouse = require("../../models/informations/warehouse.js");
const Branch = require("../../models/informations/branch.js");

let warehouse = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [results, warehouses, languages] = await Promise.all([
                Warehouse.countDocuments(),
                Warehouse.find(),
                req.user.atlasLanguage
            ])
            res.render("information/warehouse.ejs", {
                results: results,
                warehouses: warehouses,
                languages: languages
            })
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

let newWarehouse = async (req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            if(req.method == "GET"){
                let branches = await Branch.find().sort({"id": 1})
                res.render("information/warehousenew.ejs", {
                    branches: branches
                })
            }else{
                await Warehouse.create(req.body);
                let counting = await Warehouse.countDocuments()
                await Warehouse.findOneAndUpdate({"code": req.body.code}, {$set: {"id": counting}})
                res.redirect("/informations/warehouse")
            }
        } catch (error) {
            res.render("error.ejs")
            console.log(error)
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

module.exports = {
    warehouse,
    newWarehouse
}