const User = require("../../models/user/user.js");

let language = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            res.render("users/languages", {
                languages: req.user.atlasLanguage
            });
        } catch (error) {
            res.render("error.ejs");
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

let languagePost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            await User.findByIdAndUpdate(req.user._id, {$set:{"atlasLanguage": req.body.language}});
            res.redirect("/home")
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

module.exports =  {
    language,
    languagePost,
};
