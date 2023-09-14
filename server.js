//jshint esversion:6
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
dotenv.config();
const initiation = require("./routes/initiation.js");
const tickets = require("./routes/tickets.js");
const informations = require("./routes/informations.js");
const logistic = require("./routes/logistic.js");
const comercial = require("./routes/comercial.js");
const api = require("./routes/api.js");
const metas = require("./routes/metas.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(
  session({
    secret: process.env.PASSWORD,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGOSTRING);

app.use("/", initiation);
app.use("/tickets", tickets);
app.use("/informations", informations);
app.use("/logistic", logistic);
app.use("/comercial", comercial);
app.use("/api", api);
app.use("/metas", metas);

app.listen(process.env.PORT, function () {
  console.log("Node.js operational at port " + process.env.PORT);
});
