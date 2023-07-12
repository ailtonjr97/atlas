const Produtos = require("../../models/logistica/produtos.js")
const Warehouse = require("../../models/informations/warehouse.js");
const ProductMovement = require("../../models/informations/productsMovements.js");
const axios = require("axios")


const produtosAtualizar = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True" && req.user.isAdmin == "True"){
        try {
            const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_PRO/get_all", {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
            const response = await axios.get(process.env.APITOTVS + "CONSULTA_PRO/get_all?limit=" + limitador.data.meta.total, {auth: {username: "admin", password: process.env.SENHAPITOTVS}})
            await Produtos.deleteMany();
            Produtos.create(response.data.objects);
            res.redirect("/logistica/produtos/consultar")
          } catch (error) {
              res.send("Erro ao executar")
          }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const produtosConsultar = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const [produtos, contagem, admin] = await Promise.all([
                Produtos.find().sort({"desc": 1}),
                Produtos.countDocuments(),
                req.user.isAdmin
            ])
            res.render("logistica/produtos/consultar", {
                "produtos": produtos,
                "contagem": contagem,
                "admin": admin
            })
        } catch (error) {
            res.render("error")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    };
}

const produtosDetalhes = async(req, res)=>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            const detalhes = await Produtos.find({"_id" : req.params.id})
            res.render("logistica/produtos/detalhe", {
                "detalhes": detalhes[0]
            })
        } catch (error) {
            res.render("error")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    };
}

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
                const [product, warehouse] = await Promise.all([
                    Product.findById(req.params.id),
                    Warehouse.find().sort({"name": 1})
                ])
                res.render("logistic/products/addproduct", {
                    products: product,
                    warehouses: warehouse
                });
            } else{
                const [productWarehouse, movementIndex] = await Promise.all([
                    Product.find({"_id": req.params.id}, {"name": 1, "code": 1, "_id": 0}),
                    ProductMovement.countDocuments()
                ])
                let dataProducts = [{
                    "receiptNumber": req.body.receiptNumber,
                    "receiptDate": req.body.receiptDate,
                    "receiptQuantity": req.body.receiptQuantity,
                    "receiptPrice": req.body.receiptPrice,
                    "receiptComment": req.body.receiptComment,
                    "receiptWarehouse": req.body.receiptWarehouse
                }]
                let dataMovements = [{
                    "id": movementIndex,
                    "productCode": productWarehouse[0].code,
                    "productName": productWarehouse[0].name,
                    "movement": "Entry",
                    "quantity": req.body.receiptQuantity,
                    "productPrice": req.body.receiptPrice,
                    "documentDate": req.body.receiptDate,
                    "comment": req.body.receiptComment
                }]
                await Promise.all([
                    Product.findByIdAndUpdate(req.params.id, {
                        $inc: {"quantity": req.body.receiptQuantity},
                        $push: {"entries": dataProducts}
                    }),
                    Warehouse.findOneAndUpdate({"code": req.body.receiptWarehouse}, {
                        $push: {"products": [{"name": productWarehouse[0].name, "code": productWarehouse[0].code, "quantity": req.body.receiptQuantity}]}
                    }),
                    ProductMovement.create(dataMovements)
                ]);
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

let exitProduct = async(req, res) =>{
    if(req.isAuthenticated() && req.user.isActive == "True"){
        try {
            if(req.method == "GET"){
                const [product, warehouse, inStorage] = await Promise.all([
                    Product.findById(req.params.id),
                    Warehouse.find().sort({"name": 1}),
                    Product.findById(req.params.id, {"quantity": 1, "_id": 0})
                ])
                res.render("logistic/products/exitproduct", {
                    products: product,
                    warehouses: warehouse,
                    inStorage: inStorage
                });
            } else{
                const [productWarehouse, movementIndex] = await Promise.all([
                    Product.find({"_id": req.params.id}, {"name": 1, "code": 1, "_id": 0}),
                    ProductMovement.countDocuments()
                ])
                let dataMovements = [{
                    "id": movementIndex,
                    "productCode": productWarehouse[0].code,
                    "productName": productWarehouse[0].name,
                    "movement": "Exit",
                    "warehouse": req.body.receiptWarehouse,
                    "quantity": req.body.receiptQuantity,
                    "productPrice": req.body.receiptPrice,
                    "documentDate": req.body.receiptDate,
                    "comment": req.body.receiptComment
                }]
                await Promise.all([
                    Product.findByIdAndUpdate(req.params.id, {
                        $inc: {"quantity": (req.body.receiptQuantity) * -1}
                    }),
                    ProductMovement.create(dataMovements)
                ]);
                res.redirect("/logistic/products");
            }
        } catch (error) {
            res.render("error.ejs")
        }
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
      };
}

const apiProdutosIntranet = async(req, res)=>{
  const auth = {login: process.env.LOGININTRANET, password: process.env.SENHAINTRANET}

  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  if (login && password && login === auth.login && password === auth.password) {
    res.send(await Produtos.find())
  }else{
    res.send("Negado")
  }
}

module.exports = {
    produtosAtualizar,
    produtosConsultar,
    produtosDetalhes,
    apiProdutosIntranet
};