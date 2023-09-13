const express = require("express");
const ProductManager = require("../productManager")

const router = express.Router()

const productManager = new ProductManager();


router.get("/products", async (req, res) =>{
  try {
      const limite = req.query.limit;
      const products = await productManager.getProducts();

      if (!limite) {
          res.json(products);
      } else {
          const limiteNum = parseInt(limite);

          if (!isNaN(limiteNum)) {
              const limitedProducts = products.slice(0, limiteNum);
              res.json(limitedProducts);
          } else {
              res.status(400).json({ error: 'El parámetro "limit" no es un número válido.' });
          }
      }
  } catch (error) {
      console.log('Error', error);
  }
})

router.get("/product/:pid", async (req, res) =>{
    try{
        const productId = parseInt(req.params.pid);
        const product= await productManager.getProductById(productId);
        res.send({producto : product});
        }catch(error){
            console.log('Error', error);
    }
})

router.post("/products", async (req, res) => {
  try {
    const newProduct = req.body
    const product = await productManager.addProduct(newProduct)
    res.send({producto: product})
  } catch (error) {
    console.log("Error", error);
  }
})

module.exports = router