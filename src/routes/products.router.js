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
    res.status(200).send({message: "Producto agregado correctamente", product})
  } catch (error) {
    console.log("Error al agregar el producto", error);
  }
})

router.put("/product/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updateProduct = req.body
    const product = await productManager.updateProduct(productId, updateProduct)
    res.status(200).send({message:"Producto actualizado con Éxitio", product})
  } catch (error) {
    console.error("Error al actualizar el producto", error)
    res.status(500).send({message: "Error al actualiza el producto"})
  }
})

router.delete("/product/:pid", async(req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.deleteProduct(productId)
    res.status(200).send({ message:'Producto eliminado exitosamente', product })
  } catch (error) {
    console.error("No se pudo eliminar el producto", error)
    res.status(500).send({message: "Error al eliminar el producto"})
  }
})

module.exports = router