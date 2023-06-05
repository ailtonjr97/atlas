const Product = require("../models/products.js")

let products = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [products, results] = await Promise.all([
                Product.find().sort({"name": -1}),
                Product.countDocuments()
            ])
            res.render("logistic/products/products.ejs", {
                products: products,
                results: results
            })
        } catch (error) {
            res.render("error.ejs");
        };
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

let newProduct = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        res.render("logistic/products/newproduct");
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

let newProductPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            let data = req.body;
            await Promise.all([
                await Product.create(data),
                Product.findOneAndUpdate({"code": req.body.code}, {$set: {
                    "quantity": 0,
                    "isActive": true
                }})
            ]);
            res.redirect("/logistic/products");
        } catch (error) {
            console.log(error);
            res.render("error.ejs");
        };
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
};

let editProduct = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            let product = await Product.findById(req.params.id);
            res.render("logistic/products/editproduct", {
                product: product
            })
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

let editProductPost = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            await Product.findByIdAndUpdate(req.params.id, req.body);
            res.redirect("/logistic/products")
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

let addProduct = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            if(req.method == "GET"){
                let product = await Product.findById(req.params.id);
                res.render("logistic/products/addproduct", {
                    products: product
                });
            } else{
                let receiptJsDate = new Date();
                //Taking Date from JS an converting to local time of Brazil (UTC -03:00)
                receiptJsDate.setHours(receiptJsDate.getHours() - 3);
                let data = [{
                    "receiptNumber": req.body.receiptNumber,
                    "receiptDate": req.body.receiptDate,
                    "receiptJsDate": receiptJsDate,
                    "receiptQuantity": req.body.receiptQuantity,
                    "receiptComment": req.body.receiptComment 
                }]
                await Product.findByIdAndUpdate(req.params.id, {$inc: {"quantity": req.body.receiptQuantity}, $push: {"entries": data}});
                res.redirect("/logistic/products");
            }
        } catch (error) {
            console.log(error);
            res.render("error.ejs");
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

module.exports = {
    products,
    newProduct,
    newProductPost,
    editProduct,
    editProductPost,
    addProduct
};