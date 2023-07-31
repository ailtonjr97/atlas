const Carrier = require("../../models/logistic/carriers.js")

const carriersAll = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [carriers, results] = await Promise.all ([
                Carrier.find(),
                Carrier.countDocuments()
            ])
            res.render("logistic/carriers/all", {
                carriers: carriers,
                results: results
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
    carriersAll
}