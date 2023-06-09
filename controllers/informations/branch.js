const Branch = require("../../models/informations/branch.js")
const axios = require("axios")

let branches = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        let branches = await Branch.find();
        let results = await Branch.countDocuments();
        res.render("information/branchall", {
            results: results,
            branches: branches
        });
    } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };
};

let newBranch = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            let countries = [];
            let response = await axios.get("https://restcountries.com/v3.1/all");
            response.data.forEach(element => {
                countries.push(element.name.common);
            });
            res.render("information/branchnew",{
                countries: countries.sort()
            });
        } catch (error) {
            console.log(error)
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

let newBranchPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            let result = req.body;
            await Branch.create(result);
            let counter = await  Branch.countDocuments();
            await Branch.findOneAndUpdate({"name": req.body.name}, {$set: {"id": counter}});
            res.redirect("/informations/branches");
        } catch (error) {
            res.render("error.ejs")
        };
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

module.exports = {
    branches,
    newBranch,
    newBranchPost
};
