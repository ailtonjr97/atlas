const Carrier = require("../../models/logistic/carriers.js")
const path = require("path");
const crypto = require('crypto');
const mongoose = require("mongoose");
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const MethodOverride = require('method-override');
const bodyParser = require('body-parser')

const conn = mongoose.createConnection(process.env.MONGOSTRING)

let gfs;

conn.once('open', () =>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('anexos');
})

const storage = new GridFsStorage({
    url: process.env.MONGOSTRING,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'anexos'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

const carriersAll = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [carriers, results, languages] = await Promise.all ([
                Carrier.find(),
                Carrier.countDocuments(),
                req.user.atlasLanguages
            ])
            res.render("logistic/carriers/all", {
                carriers: carriers,
                results: results,
                languages: languages
            })
        } catch (error) {
            console.log(error)
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const carriersUpload = async(req, res)=>{
    res.json(req.file)
}

const verImagem = async(req, res)=>{
    res.json(req.file)
}

module.exports = {
    carriersAll,
    carriersUpload
}