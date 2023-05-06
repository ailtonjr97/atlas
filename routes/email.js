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

router.get("/testaEmail", (req, res) => {
  async function main() {
    let transporter = nodemailer.createTransport({
      host: "outlook.maiex13.com.br",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "",
      },
    });

    let info = await transporter.sendMail({
      from: '"Ailton" informatica04@fibracem.com',
      to: "sistema@fibracem.com",
      subject: "Teste email",
      text: "Teste",
      html: "<b>Hello world?</b>",
    });
  }

  main().catch(console.error);
});
