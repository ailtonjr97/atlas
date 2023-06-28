const Department = require("../../models/informations/departments.js");

let departments = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            let results = await Department.countDocuments();
            let departments = await Department.find();
            res.render("information/departmentall", {
                results: results,
                departments: departments
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
        try {
            res.render("information/departmentnew")
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
            res.redirect("information/department");
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