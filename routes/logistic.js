const express = require("express");
const router = express.Router();
const {products, newProduct, newProductPost, editProduct, editProductPost} = require('../controllers/products.js');

router.get("/products", products);
router.get("/newproduct", newProduct);
router.post("/newproduct", newProductPost);
router.get("/editproduct/:id", editProduct);
router.post("/editproduct/:id", editProductPost)

module.exports = router;