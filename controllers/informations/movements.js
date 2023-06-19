const ProductsMovements = require("../../models/informations/productsMovements.js")

let movements = async (req,res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [results, productMovements] = await Promise.all([
                ProductsMovements.countDocuments(),
                ProductsMovements.find()
            ])
            res.render("information/movements.ejs", {
                results: results,
                productMovements: productMovements
            })
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

module.exports = {
    movements
};