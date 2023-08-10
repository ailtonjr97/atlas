const express = require("express");
const router = express.Router();
const {login, loginError, landing, authenticate, home, logout} = require('../controllers/initiation/login.js');
const {users, newuser, registerUser, inactiveusers, passwordReset, editUser, editUserPost, changePassword, changePasswordPost, activateUser, inactivateUser} = require('../controllers/user/users.js');
const {language, languagePost} = require('../controllers/user/language.js');
const {atlas} = require("../controllers/initiation/atlas.js");
const {indicador, indicadorComercialVendas} = require("../controllers/initiation/indicador.js");
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');
const mongoose = require("mongoose");
const crypto = require('crypto');
const path = require("path");

const conn = mongoose.createConnection(process.env.MONGOSTRING)

conn.once('open', () =>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('userPhoto');
})

const storage = new GridFsStorage({
    url: process.env.MONGOSTRING,
    file: (req, file) => {
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                  if (err) {
                    return reject(err);
                  }
                  const filename = buf.toString('hex') + path.extname(file.originalname);
                  const fileInfo = {
                    filename: file.originalname + "_" + Date.now(),
                    bucketName: 'userPhoto',
                    originalName: file.originalname,
                    sizeMB: file.size / 1000000
                  };
                  resolve(fileInfo);
                });
            });
        }else{
            return (new Error('Only images are allowed'));
        }
    }
  });
  const upload = multer({ storage });

//Login and authentication
router.get("/", landing);
router.get("/login", login);
router.get("/loginerror", loginError);
router.post("/authenticate", authenticate);
router.get("/home", home);
router.get("/logout", logout);

//Users functions, like add, remove, and edit
router.get("/users", users);
router.get("/users/newuser", newuser);
router.post("/users/register", upload.single('userPhoto'), registerUser);
router.get("/users/inactiveusers", inactiveusers);
router.get("/users/resetpassword/:id", passwordReset);
router.get("/users/edituser/:id", editUser);
router.post("/users/edituser/:id", upload.single('userPhoto'), editUserPost);
router.get("/users/changepassword/:id", changePassword);
router.post("/users/changepassword/:id", changePasswordPost);
router.get("/users/activateuser/:id", activateUser);
router.get("/users/inactivateuser/:id", inactivateUser);

//Language change of Atlas
router.get("/languages/", language);
router.post("/languages/", languagePost);

//Page showing (and trying to sell) Atlas to the user
router.get("/atlas", atlas)

//indicadores
router.get("/indicador", indicador)
router.get("/indicador/comercial/vendas", indicadorComercialVendas)

module.exports = router;
