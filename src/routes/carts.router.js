const express = require("express");
const fs = require("fs/promises")

const router = express.Router()

async function _loadProductsFromFile() {
  try {
    const data = await fs.readFile("carrito.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function _loadCartsFromFile() {
  try {
    const data = await fs.readFile("carrito.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

router.post("/carts", async (req, res) => {
  try {
    const carrito = await _loadCartsFromFile()
    const id = carrito.length + 1;
    const nuevoCarrito = {id, products: []}
    carrito.push(nuevoCarrito)
    await fs.writeFile("carrito.json", JSON.stringify(carrito));
    res.status(200).send({message: "Nuevo carrito creado"})
  } catch (error) {
    console.log("Error al crear im carrito nuevo", error);
    res.status(500).send({message: "Error al crear un nuevo carrito"})    
  }  
})

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const carrito = await _loadCartsFromFile();
    const carritoEncontrado = carrito.find((c) => c.id === cartId);
    
    if (!carritoEncontrado) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    res.send({ carrito: carritoEncontrado });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).send({ message: "Error al obtener el carrito" });
  }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const carrito = await _loadCartsFromFile();
    const productos = await _loadProductsFromFile();
    const carritoEncontrado = carrito.find((c) => c.id === cartId);

    if (!carritoEncontrado) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }

    const productoExistente = productos.find((p) => p.id === productId);

    if (!productoExistente) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }

    const productoIndex = carritoEncontrado.products.findIndex((p) => p.product === productId);

    if (productoIndex !== -1) {
      carritoEncontrado.products[productoIndex].quantity += 1;
    } else {
      carritoEncontrado.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile("carrito.json", JSON.stringify(carrito));

    res.status(200).send({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar el producto al carrito", error);
    res.status(500).send({ message: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;
