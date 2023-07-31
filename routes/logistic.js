const express = require("express");
const router = express.Router();
const {productsAll, newProduct, newProductPost, editProduct} = require('../controllers/logistic/products.js');
const {carriersAll} = require('../controllers/logistic/carriers.js');

router.get("/products/all", productsAll);
router.get("/products/newproduct", newProduct);
router.post("/products/newproduct", newProductPost);
router.get("/products/edit/:id", editProduct);

router.get("/carriers/all", carriersAll);

module.exports = router;