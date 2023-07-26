const Ticket = require("../../models/ticket/ticket.js");
const Department = require("../../models/informations/departments.js");
const Branch = require("../../models/informations/branch.js");
const User = require("../../models/user/user.js");

let ticketall = async(req, res) => {
    if (req.isAuthenticated() && req.user.isActive == "True"){
      const [tickets, results, languages] = await Promise.all([
        Ticket.find().sort({"idticket": -1}),
        Ticket.countDocuments({"inactive": {$eq: false}}),
        req.user.atlasLanguage
      ])
      res.render("ticket/ticketall",{
        tickets: tickets,
        results: results,
        languages: languages
      })
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  };
  
let newTicket = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
      try {
        const[department, branch, languages] = await Promise.all([
          Department.find(),
          Branch.find(),
          req.user.atlasLanguage
        ])
        res.render("ticket/ticketnew", {
          departments: department,
          branches: branch,
          languages: languages
        })
      } catch (error) {
        res.render("error.ejs")
      }
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  }
  
let newTicketPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
      try {
        await Ticket.create(req.body)
        let last_id = await Ticket.find({}, {_id: 1}).sort({_id:-1}).limit(1)
        await Ticket.findByIdAndUpdate(last_id[0]._id, {$set: {
          "idticket": await Ticket.countDocuments(),
          "requester": req.user.name,
          "inactive": false,
          "response": ''
        }})
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
    if(req.isAuthenticated() && req.user.isActive == "True"){
      try {
        Ticket.findOneAndUpdate({"_id": req.params.id}, {$set: {inactive: true}}).then(()=>{
          res.redirect("/tickets/")
        });
      } catch (error) {
        res.render("error.ejs")
      };
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    };
  };
  
let myTickets = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
      try {
        const [tickets, results, languages] = await Promise.all([
          Ticket.find({"requester": req.user.name}).sort({"idticket": -1}),
          Ticket.countDocuments({"requester": req.user.name}),
          req.user.atlasLanguage
        ])
        res.render("ticket/ticketsmy", {
          tickets: tickets,
          results: results,
          languages: languages
        });
      } catch (error) {
        res.render("error.ejs")
      };
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    };
  }
  
let response = async(req, res)=>{
    if(req.isAuthenticated()  && req.user.isActive == "True"){
      try {
        Ticket.findOneAndUpdate({"idticket": req.body.idticket}, {$set: {"response": req.body.response}}).then(()=>{
          res.redirect("/tickets/")
        })
      } catch (error) {
        res.render("error.ejs")
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