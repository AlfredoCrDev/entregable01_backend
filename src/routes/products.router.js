const express = require("express");
const ProductManager = require("../Dao/productManagerMDB")

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
        const productId = (req.params.pid);
        const product= await productManager.getProductById(productId);
        res.send({producto : product});
        }catch(error){
            console.log('Error', error);
    }
})

router.post("/products", async (req, res) => {
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

router.put("/product/:pid", async (req, res) => {
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

router.delete("/product/:pid", async(req, res) => {
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