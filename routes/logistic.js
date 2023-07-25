const express = require("express");
const router = express.Router();
const {productsAll} = require('../controllers/logistic/products.js');

router.get("/products/all", productsAll);

module.exports = router;