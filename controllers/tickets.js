const Ticket = require("../models/ticket.js");
const Department = require("../models/departments.js");
const Branch = require("../models/branch.js");

let ticketall = async(req, res) => {
    if (req.isAuthenticated()){
      Ticket.find().sort({"idticket": -1}).then((tickets)=>{
        Ticket.countDocuments({"inactive": {$eq: false}}).then((results)=>{
          res.render("ticket/ticketall",{
            results: results,
            tickets: tickets
          })
        })
      })
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  };
  
let newTicket = async(req, res)=>{
    if(req.isAuthenticated()){
      try {
        const[department, branch] = await Promise.all([
          Department.find(),
          Branch.find(),
        ])
        res.render("ticket/ticketnew", {
          departments: department,
          branches: branch
        })
      } catch (error) {
        res.send("Error. Contact your IT department.")
      }
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  }
  
let newTicketPost = async(req, res)=>{
    if(req.isAuthenticated() && user.req.isActive == "True"){
      try {
        const [] = await Promise.all([
          await Ticket.create(req.body),
          Ticket.findOneAndUpdate({}, {$set: {
            
          }}).sort({_id:-1})
        ])
        res.redirect("/tickets");
      } catch (error) {
        res.render("error.ejs")
      }
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  };
  
let inactivate =  async(req, res)=>{
    if(req.isAuthenticated()){
      try {
        Ticket.findOneAndUpdate({"_id": req.params.id}, {$set: {inactive: true}}).then(()=>{
          res.redirect("/tickets/")
        });
      } catch (error) {
        res.send("Error. Contact your IT department.")
      };
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    };
  };
  
let myTickets = async(req, res)=>{
    if(req.isAuthenticated()){
      try {
        Ticket.find({"requester": req.user.name}).sort({"idticket": -1}).then((tickets)=>{
          Ticket.countDocuments({"requester": req.user.name}).then((results)=>{
            res.render("ticket/ticketsmy", {
              tickets: tickets,
              results: results
            });
          });
        });
      } catch (error) {
        res.send("Error. Contact your IT department." + error)
      };
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    };
  }
  
let response = async(req, res)=>{
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
  }

  module.exports =  {
    ticketall,
    newTicket,
    newTicketPost,
    inactivate,
    myTickets,
    response
};