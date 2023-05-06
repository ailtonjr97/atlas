const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

router.get("/public/anexos/:anexoNome", function (req, res) {
  if (req.isAuthenticated()) {
    var options = {
      root: path.join(__dirname + "\\public\\anexos"),
    };

    var fileName = req.params.anexoNome;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        res.send(err);
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/public/anexos/produtos/:anexoNome", function (req, res) {
  if (req.isAuthenticated()) {
    var options = {
      root: path.join(__dirname + "\\public\\anexos\\produtos"),
    };

    var fileName = req.params.anexoNome;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        res.send(err);
      }
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
