const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");
const Branch = require("../models/branch");
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
        let branches = await Branch.find();
        let results = await Branch.countDocuments();
        res.render("branchall", {
            results: results,
            branches: branches
        })
    } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

router.get("/newbranch", async(req, res)=>{
    if(req.isAuthenticated()){
        try {
            let countries = []
            let response = await axios.get("https://restcountries.com/v3.1/all")
            response.data.forEach(element => {
                countries.push(element.name.common)
            });
            res.render("branchnew",{
                countries: countries.sort()
            })
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      }
})

router.post("/newbranch", async(req, res)=>{
    if(req.isAuthenticated()){
        try {
            let result = req.body;
            await Branch.create(result);
            let counter = await  Branch.countDocuments();
            await Branch.findOneAndUpdate({"name": req.body.name}, {$set: {"id": counter}})
            res.redirect("/branch");
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      }
})

module.exports = router;
