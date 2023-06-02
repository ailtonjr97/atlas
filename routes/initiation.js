const express = require("express");
const router = express.Router();
const {login, landing, authenticate, home, logout} = require('../controllers/login.js');
const {users, newuser, registerUser, inactiveusers, passwordReset, editUser, editUserPost, changePassword, changePasswordPost, activateUser, inactivateUser} = require('../controllers/users.js');

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


module.exports = router;
