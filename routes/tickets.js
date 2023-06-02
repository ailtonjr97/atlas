const express = require("express");
const router = express.Router();
const {ticketall, newTicket, newTicketPost, inactivate, myTickets, response} = require('../controllers/tickets.js');

//Tickets CRUD
router.get("/", ticketall);
router.get("/newticket", newTicket);
router.post("/newticket", newTicketPost);
router.get("/inactivate/:id", inactivate);
router.get("/mytickets", myTickets);
router.post("/response", response);

module.exports = router;