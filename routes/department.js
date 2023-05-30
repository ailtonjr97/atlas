const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Department = require("../models/departments.js");
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/", async(req, res)=>{
    if(req.isAuthenticated()){
        try {
            let results = await Department.countDocuments();
            let departments = await Department.find();
            res.render("departmentall", {
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
});

router.get("/newdepartment", async(req, res)=>{
    if(req.isAuthenticated()){
        try {
            res.render("departmentnew")
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
});

router.post("/newdepartment", async(req, res)=>{
    try {
        let result = req.body;
        await Department.create(result);
        let counter = await  Department.countDocuments();
        await Department.findOneAndUpdate({"name": req.body.name}, {$set: {"id": counter}})
        res.redirect("/department");
    } catch (error) {
        res.render("error.ejs")
    }
})

module.exports = router;