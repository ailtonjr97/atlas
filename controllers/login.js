const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const User = require("../models/user.js");
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const login = async(req, res)=>{
    res.render("login")
}

const landing = async(req, res)=>{
  res.render("landing")
}

const authenticate = async(req, res)=>{
  user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      res.send(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        if (user) {
          res.redirect(req.session.returnTo || "/home");
          delete req.session.returnTo;
        } else {
          res.send("Negative");
        }
      });
    }
  });
};

const home = async(req, res)=>{
    if (req.isAuthenticated()) {
      try {
        let languages = await User.find({"userId": req.user.userId}, {_id: 0, "atlasLanguage": 1});
        res.render("home", {
          languages: languages
        })
      } catch (error) {
        res.sendFile("/images/error.jpg")
      }
    } else {
      res.redirect("/login");
    }
}

const logout = async(req, res)=>{
  req.logout();
  res.redirect("/");
}



module.exports =  {
    login,
    landing,
    authenticate,
    home,
    logout
};