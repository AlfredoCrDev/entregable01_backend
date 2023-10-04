const express = require("express");
const CartManager = require("../Dao/cartManagerMDB")

const router = express.Router()

const cartManager = new CartManager();

router.post("/carts", async (req, res) => {
  try {
    const cart = await cartManager.addNewCart()
    res.status(200).send({message: "Nuevo carrito creado", cart})
    console.log("Carrito creado con éxito");
  } catch (error) {
    console.log("Error al enviar productos al carrito", error);
    res.status(500).send({message: "Error al crear un nuevo carrito"})    
  }
})

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = (req.params.cid);
    const getCart = await cartManager.getCartById(cartId)
    if (getCart.success) {
      res.status(200).json({ message: getCart.message, carrito: getCart.carrito });
    } else {
      res.status(404).send({ message: getCart.message });
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).send({ message: "Error al obtener el carrito" });
  }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = (req.params.cid);
    const productId = (req.params.pid);
    const addProductToCart = await cartManager.addProductCartById(cartId, productId)
  
    if(addProductToCart.success){
      res.status(200).send({ message: addProductToCart.message});
    } else {
      res.status(404).send({ message: addProductToCart.message });
    }
    
  } catch (error) {
    console.error("Error al agregar el producto al carrito", error);
    res.status(500).send({ message: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;
