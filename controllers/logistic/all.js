let topicsLogistic = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const[languages] = await Promise.all([
                req.user.atlasLanguage
            ])
            res.render("logistic/all", {
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
    topicsLogistic
}