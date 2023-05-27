const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const Ticket = require("../models/ticket.js");
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
    Ticket.find().sort({"idticket": -1}).then((tickets)=>{
      Ticket.countDocuments({"inactive": {$eq: false}}).then((results)=>{
        res.render("ticketall",{
          results: results,
          tickets: tickets
        })
      })
    })
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
      res.send("Error. Contact your IT department.")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

router.post("/newticket", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      let counting = await Ticket.countDocuments();
      const ticket = new Ticket({
        idticket: counting,
        department: req.body.department,
        description: req.body.description,
        branch: req.body.branch,
        urgency: req.body.urgency,
        requester: req.user.dadosPessoais[0].nome,
        designated: "",
        response: "",
        inactive: false,
      });
      Ticket.create(ticket).then(()=>{
        res.redirect("/tickets/")
      });
    } catch (error) {
      res.send("Error. Contact your IT department.")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/inactivate/:id", async(req,res)=>{
  if(req.isAuthenticated()){
    try {
      Ticket.findOneAndUpdate({"_id": req.params.id}, {$set: {inactive: true}}).then(()=>{
        res.redirect("/tickets/")
      })

    } catch (error) {
      res.send("Error. Contact your IT department.")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

router.get("/mytickets", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      Ticket.find({"requester": req.user.name}).sort({"idticket": -1}).then((tickets)=>{
        Ticket.countDocuments({"requester": req.user.name}).then((results)=>{
          res.render("ticketsmy", {
            tickets: tickets,
            results: results
          })
        })
      })
    } catch (error) {
      res.send("Error. Contact your IT department." + error)
    }
  } 
  else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

router.post("/response", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      Ticket.findOneAndUpdate({"idticket": req.body.idticket}, {$set: {"response": req.body.response}}).then(()=>{
        res.redirect("/tickets/")
      })
    } catch (error) {
      res.send("Error. Contact your IT department.")
    }
  }else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
})

module.exports = router;
