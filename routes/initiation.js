const express = require("express");
const router = express.Router();
const {login, landing, authenticate, home, logout} = require('../controllers/initiation/login.js');
const {users, newuser, registerUser, inactiveusers, passwordReset, editUser, editUserPost, changePassword, changePasswordPost, activateUser, inactivateUser} = require('../controllers/user/users.js');
const {language, languagePost} = require('../controllers/user/language.js');
const {atlas} = require("../controllers/initiation/atlas.js");

//Login and authentication
router.get("/", landing);
router.get("/login", login);
router.post("/authenticate", authenticate);
router.get("/home", home);
router.get("/logout", logout);

//Users functions, like add, remove, and edit
router.get("/users", users);
router.get("/users/newuser", newuser);
router.post("/users/register", registerUser);
router.get("/users/inactiveusers", inactiveusers);
router.get("/users/resetpassword/:id", passwordReset);
router.get("/users/edituser/:id", editUser);
router.post("/users/edituser/:id", editUserPost);
router.get("/users/changepassword/:id", changePassword);
router.post("/users/changepassword/:id", changePasswordPost);
router.get("/users/activateuser/:id", activateUser);
router.get("/users/inactivateuser/:id", inactivateUser);

//Language change of Atlas
router.get("/languages/", language);
router.post("/languages/", languagePost);

//Page showing (and trying to sell) Atlas to the user
router.get("/atlas", atlas)

module.exports = router;
