const express = require("express");
const CartManager = require("../Dao/cartManagerMDB")

const router = express.Router()

const cartManager = new CartManager();


router.get("/api/carts", async (req, res) => {
  try {
    const getCarts = await cartManager.getCars()
    if (getCarts.success) {
      res.status(200).json({ message: getCarts.message, carritos: getCarts.carrito });
    } else {
      res.status(404).send({ message: getCarts.message });
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).send({ message: "Error al obtener el carrito" });
  }
});

router.get("/api/cart/:cid", async (req, res) => {
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

router.post("/api/cart", async (req, res) => {
  try {
    const cart = await cartManager.addNewCart()
    res.status(200).send({message: "Nuevo carrito creado", cart})
    console.log("Carrito creado con éxito");
  } catch (error) {
    console.log("Error al enviar productos al carrito", error);
    res.status(500).send({message: "Error al crear un nuevo carrito"})    
  }
})

router.post("/api/cart/:cid/product/:pid", async (req, res) => {
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

router.put("/api/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;
    
    const updateResult = await cartManager.updateCartWithProducts(cartId, newProducts);
    
    if (updateResult.success) {
      res.status(200).send({ message: updateResult.message });
    } else {
      res.status(404).send({ message: updateResult.message });
    }
  } catch (error) {
    console.error("Error al modificar el carrito con nuevos productos", error);
    res.status(500).send({ message: "Error al modificar el carrito con nuevos productos" });
  }
});

router.put("/api/cart/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity; // Asumiendo que envías la nueva cantidad en el cuerpo de la solicitud

    const updateResult = await cartManager.updateCartItemQuantity(cartId, productId, newQuantity);

    if (updateResult.success) {
      res.status(200).send({ message: updateResult.message });
    } else {
      res.status(404).send({ message: updateResult.message });
    }
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito", error);
    res.status(500).send({ message: "Error al actualizar la cantidad del producto en el carrito" });
  }
});

router.delete("/api/cart/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await cartManager.deleteAllProductsFromCart(cartId);
  
    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    console.log("Error al eliminar el producto");
  }
});

router.delete("/api/cart/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = (req.params.cid);
    const productId = (req.params.pid);
    const deleteProductCart = await cartManager.deleteProductFromCartById(cartId, productId)
    
    if(deleteProductCart.success){
      res.status(200).send({ message: deleteProductCart.message});
    } else {
      res.status(404).send({ message: deleteProductCart.message });
    }
    
  } catch (error) {
    console.error("Error al agregar el producto al carrito", error);
    res.status(500).send({ message: "Error al agregar el producto al carrito" });
  }
})
  
  // GET PARA RENDERIZAR UNA VISTA HBS
  router.get("/carts/:cid", async (req, res) => {
    try {
      const cartId = (req.params.cid);
      const productsInTheCart = await cartManager.getCartById(cartId)
      
      res.render("cartView", { productsInTheCart })
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).send({ message: "Error al obtener el carrito" });
    }
  });

module.exports = router;