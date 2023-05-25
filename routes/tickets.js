const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Ticket = require("../models/ticket.js");
const Anexo = require("../models/anexos.js");
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

router.get("/", async(req, res) => {
  if (req.isAuthenticated()){
    Ticket.find().then((tickets)=>{
      Ticket.find().countDocuments().then((results)=>{
        res.render("ticketall",{
          results: results,
          tickets: tickets
        })
      })
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/newticket", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      res.render("ticketnew")
    } catch (error) {
      res.send("Error. Try again later")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

router.post("/newticket", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      let ticketid = await Ticket.find().countDocuments;
      const ticket = new Ticket({
        idticket: ticketid,
        department: req.body.department,
        description: req.body.description,
        branch: req.body.branch,
        urgency: req.body.urgency,
        requester: req.user.dadosPessoais[0].nome,
        designated: "",
        response: "",
        inactive: false,
      });
      await Ticket.create(ticket);
      res.redirect("/ticketall")
    } catch (error) {
      res.send("Error. Try again later.")
    }
  }
});

module.exports = router;
