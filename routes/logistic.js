const express = require("express");
const router = express.Router();
const {productsAll, newProduct, newProductPost, editProduct, editProductPost, addProduct, exitProduct} = require('../controllers/logistic/products.js');
const {carriersAll} = require('../controllers/logistic/carriers.js');
const {topicsLogistic} = require('../controllers/logistic/all.js');

router.get("/", topicsLogistic);
router.get("/products/all", productsAll);

router.get("/products/newproduct", newProduct);
router.post("/products/newproduct", newProductPost);

router.get("/products/edit/:id", editProduct);
router.post("/products/edit/:id", editProductPost);

router.get("/products/entry/:id", addProduct);
router.post("/products/entry/:id", addProduct);

router.get("/products/exit/:id", exitProduct);
router.post("/products/exit/:id", exitProduct);

router.get("/carriers/all", carriersAll);

module.exports = router;