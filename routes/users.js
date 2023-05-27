const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
dotenv.config();
const app = express();
const User = require("../models/user.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/", async(req, res)=>{
  if (req.isAuthenticated()) {
    try {
      let users = await User.find({"isActive": "True"}).sort({"name": 1});
      let results = await User.countDocuments({"isActive": "True"});
      let isAdmin = req.user.isAdmin;
      let loggedin = req.user.username
      res.render("users", {
        loggedin: loggedin,
        users: users,
        results: results,
        isAdmin: isAdmin
      });
    } catch (error) {
      res.render("error.ejs");
    };
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };
});

router.get("/newuser", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      res.render("usersnew");
    } catch (error) {
      res.render("error.ejs");
    };
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };
});

router.post("/register", async (req, res)=> {
  if(req.isAuthenticated()){
    try {
      User.register({username: req.body.username }, req.body.password, async(err, user)=> {
        let userId = await User.countDocuments();
        await User.findOneAndUpdate({"username": req.body.username}, {
          $set: {
            name: req.body.name,
            branch: req.body.branch,
            department: req.body.department,
            userId: userId,
            isAdmin: req.body.isAdmin,
            isActive: req.body.isActive
          }
        });
        res.redirect("/users/")
      }
    );
  } catch (error) {
    res.render("error.ejs")
  }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };
});

router.get("/inactiveusers", async(req, res)=>{
  if(req.isAuthenticated()){
    try {
      let isAdmin = req.user.isAdmin;
      let users = await User.find({"isActive": "False"})
      let results = await User.countDocuments({"isActive": "False"});
      res.render("users", {
        users: users,
        isAdmin: isAdmin,
        results: results
      })
    } catch (error) {
      res.render("error.ejs")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };
})

//Will reset password to 123456
router.get("/resetpassword/:id", async(req, res)=> {
  if(req.isAuthenticated()){
    try {
      await User.updateMany({ _id: req.params.id },{
        $set: {
          salt: process.env.SALT,
          hash: "35718566d516cba90efc30b3c99a79deb43cbda7f4827976e975296e351f5f0efa416d7a23a01db2162e8ea4f51cf8f20c3071d632b94db29b1b41b19e8300175621424851ef77a84960c1661ce85a82ce40044185777ed2f0d0085a7ce2e5526d3d687d8983e859714fc1844de00171bb02a927578c71c8b077343be60401f9aeb7aad095886a6e820b34aeaadc1a55689e1f2cea51bf1ad32ce35ecb00b43c1ebaeef56d87facf22a1b16ad08c9d2792333ef9b0affb5bc1b06ca88715f527ae403a6cd6f35bce77972b6d7c71ce2e6488ccfd4a07ab8946cb3932fbfc71131f10d7c97dc1020f93c1ac3205335cb02817642f8bc367ed84899135132d93e4db9b3b95b52b1182196f042c3b3c17ac5070137153136bcf875a2f424f9ec3cf1422586718c0dc83cde66b53edfd06bb1d22acc5cb3daeee579b57858c1f43461edb57547fbce3d5d05b6f1dd5811339d2fa6ee0cbe900f58970d20dcfb72a607ac6335fe6fe9dbe33c99117b91a92a5d559823141064018a6e72936dc069c0056be1e05a9c735d35ea884a3b35a126743eeeb9b4668f179e4a99a1e1a9d2a65ecba8a39cfef18f60581730904c6c94835ee257874bb712aec3911efff35e08434c02a92575a15f67c6d40743769cdeb78583b91f0fd6db3b997db463618dd5f7e79ceab90a2c6d4bcf27e652fe806a7eb8a5359843cb24be73b83cca9e5f01f"
        }
      })
      res.redirect("/users/")
    } catch (error) {
      res.render("error.ejs")
    }
  }
});

router.get("/edituser/:id", async(req, res) =>{
  if (req.isAuthenticated()) {
    try {
      let user = await User.findOne({"_id": req.params.id})
      res.render("usersedit",{
        user: user
      })
    } catch (error) {
      res.render("error.ejs")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/edituser/:id", async(req, res) =>{
  if (req.isAuthenticated()) {
    try {
      let updates = req.body
      await User.findOneAndUpdate({"_id": req.params.id}, updates)
      res.redirect("/users/")
    } catch (error) {
      res.render("error.ejs")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/changepassword/:id", async(req, res) =>{
  if (req.isAuthenticated()) {
    try {
      let loggedin = req.user
      res.render("userschangepassword",{
        loggedin: loggedin
      })
    } catch (error) {
      res.render("error.ejs")
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post('/changepassword/:id', function (req, res) {
  User.findById(req.params.id, (err, user) => {
      if (err) {
          res.render("error.ejs");
      } else {
          user.changePassword(req.body.oldpassword, 
          req.body.newpassword, function (err) {
              if (err) {
                  res.render("error.ejs")
              } else {
                  res.redirect('/users/')
              }
          });
      }
  });
});

module.exports = router;
