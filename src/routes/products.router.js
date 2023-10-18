const express = require("express");
const ProductManager = require("../Dao/productManagerMDB")
const { productModel } = require("../models/products.model")

const router = express.Router()

const productManager = new ProductManager();

router.get("/products", async(req, res) => {
  try {
    if(!req.session.email){
      return res.redirect("/api/sessions/login")
    }
    const { limit = 10 , page = 1} = req.query;

    const products = await productManager.getProducts(limit, page,)

    res.render("productos", { 
      title: "Lista de productos",
      products: products,
      email : req.session.email,
      rol: req.session.rol
     })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
  }
})

router.get("/api/products", async (req, res) =>{
  try {
    const { limit = 10 , page = 1, sort, status, category} = req.query;

    const queryOptions = {};

    if (limit) {
      queryOptions.limit = parseInt(limit);
    } else {
      queryOptions.limit = 10;
    }

    queryOptions.page = parseInt(page);

    if (sort) {
      queryOptions.sort = sort === "asc" ? "price" : "-price";
    }

    const filter = {};

    if (category) {
      filter.category = category;
    } else if (status === "true") {
      filter.status = true;
    } else if (status === "false") {
      filter.status = false;
    }

    const result = await productModel.paginate(filter, queryOptions);

    res.json({
      status: "success",
      payload: result.docs,
      limit: result.limit,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?limit=${limit}&page=${result.nextPage}`
        : null,
    });
  } catch (error) {
      console.log('Error', error);
  }
})

router.get("/api/product/:pid", async (req, res) =>{
    try{
        const productId = (req.params.pid);
        const product= await productManager.getProductById(productId);
        res.send({producto : product});
        }catch(error){
            console.log('Error', error);
    }
})

router.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body
    if(newProduct.id || newProduct._id){
      res.status(400).json({"message": "No se permite enviar el ID de forma manual" })
    }
    const product = await productManager.addProduct(newProduct)
    res.status(200).send({message: "Producto agregado correctamente", product})
  } catch (error) {
    console.log("Error al agregar el producto", error);
  }
})

router.put("/api/product/:pid", async (req, res) => {
  try {
    const productId = (req.params.pid);
    const updateProduct = req.body
    const result = await productManager.updateProduct(productId, updateProduct)
    if (result.success) {
      res.status(200).send({ message: result.message, product: result.product });
    } else {
      res.status(404).send({ message: result.message });
    }
  } catch (error) {
    console.error("Error al actualizar el producto", error);
    res.status(500).send({ message: "Error al actualizar el producto" });
  }
})

router.delete("/api/product/:pid", async(req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.deleteProduct(productId);

    if (product.success) {
      res.status(200).send({ message: product.message, product: product.product });
    } else {
      res.status(404).send({ message: product.message });
    }
  } catch (error) {
    console.error("No se pudo eliminar el producto", error);
    res.status(500).send({ message: "Error al eliminar el producto" });
  }
});

module.exports = router