const express = require("express");
const router = express.Router();
const{plastMetaConsultar} = require("../controllers/API/api.js")

router.get("/plastmeta/consultar", plastMetaConsultar);

module.exports = router;