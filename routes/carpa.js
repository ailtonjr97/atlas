const express = require("express");
const router = express.Router();
const{bagre} = require("../controllers/peixe/bagre.js")

router.get("/bagre", bagre);

module.exports = router;