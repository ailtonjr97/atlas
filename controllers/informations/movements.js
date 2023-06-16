let movements = async (req,res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            res.render("information/movements.ejs", {
                results: results
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