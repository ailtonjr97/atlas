const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const User = require("../models/user.js");
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
        let languages = await User.find({"userId": req.user.userId}, {_id: 0, "atlasLanguage": 1});
        try {
            res.render("languages", {
                languages: languages
            });
        } catch (error) {
            res.render("error.ejs");
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
})

router.post("/", async(req, res)=>{
    if(req.isAuthenticated()){
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
})

module.exports = router;
