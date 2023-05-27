const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
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

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get("/", function (req, res) {
  res.render("landing");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/authenticate", function (req, res) {
  const user = new User({
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
});

router.get("/home", function (req, res) {
  if (req.isAuthenticated()) {
    try {
      res.render("home")
    } catch (error) {
      res.sendFile("/images/error.jpg")
    }
  } else {
    res.redirect("/login");
  }
});


router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
