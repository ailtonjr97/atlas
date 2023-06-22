const express = require("express");
const router = express.Router();
const {
    products, 
    newProduct, 
    newProductPost, 
    editProduct, 
    editProductPost, 
    addProduct,
    exitProduct
    } = require('../controllers/logistic/products.js');

router.get("/products", products);
router.get("/newproduct", newProduct);
router.post("/newproduct", newProductPost);
router.get("/editproduct/:id", editProduct);
router.post("/editproduct/:id", editProductPost);
router.get("/productentry/:id", addProduct);
router.post("/productentry/:id", addProduct);
router.get("/productexit/:id", exitProduct);
router.post("/productexit/:id", exitProduct);

module.exports = router;