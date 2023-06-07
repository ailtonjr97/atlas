const Warehouse = require("../../models/informations/warehouse.js");
const Branch = require("../../models/informations/branch.js");

let warehouse = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [results, warehouses] = await Promise.all([
                Warehouse.countDocuments(),
                Warehouse.find()
            ])
            res.render("information/warehouse.ejs", {
                results: results,
                warehouses: warehouses
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
        if(req.method == "GET"){
            let branches = await Branch.find().sort({"name": -1})
            res.render("information/warehousenew.ejs", {
                branches: branches
            })
        }else{

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