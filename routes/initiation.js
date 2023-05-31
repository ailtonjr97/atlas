const express = require("express");
const router = express.Router();
const {login, landing, authenticate, home, logout} = require('../controllers/login.js');



router.get("/", landing);
router.get("/login", login);
router.post("/authenticate", authenticate);
router.get("/home", home);
router.get("/logout", logout);

module.exports = router;
