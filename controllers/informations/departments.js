const Department = require("../../models/informations/departments.js");

let departments = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const[results, departments, languages] = await Promise.all([
                Department.countDocuments(),
                Department.find(),
                req.user.atlasLanguage
            ])
            res.render("information/departmentall", {
                results: results,
                departments: departments,
                languages: languages
            })
        } catch (error) {
            res.render("error.ejs");
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

let newDepartment = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        let languages = await req.user.atlasLanguage
        try {
            res.render("information/departmentnew", {
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

let newDepartmentPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            let result = req.body;
            await Department.create(result);
            let counter = await  Department.countDocuments();
            await Department.findOneAndUpdate({"name": req.body.name}, {$set: {"id": counter}});
            res.redirect("departments");
        } catch (error) {
            res.render("error.ejs")
        };
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

module.exports = {
    departments,
    newDepartment,
    newDepartmentPost
};