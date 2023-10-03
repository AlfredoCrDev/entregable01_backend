const fs = require("fs/promises");

class CartManager{
  constructor() {
    this.carts = [];
  }

  async _loadProductsFromFile() {
    try {
      const data = await fs.readFile("productos.json", "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  
  async _loadCartsFromFile() {
    try {
      const data = await fs.readFile("carrito.json", "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async addNewCart(){
    try {
      const carrito = await this._loadCartsFromFile()
      const id = carrito.length + 1;
      const nuevoCarrito = {id, products: []}
      carrito.push(nuevoCarrito)
      await fs.writeFile("carrito.json", JSON.stringify(carrito))
    } catch (error) {
      console.log("Error al tratar de crear el carrito", error);
    }
  }

  async getCartById(id){
    try {
      const carrito = await this._loadCartsFromFile();
      const carritoEncontrado = carrito.find((c) => c.id === id);
      if (!carritoEncontrado) {
        return {
          success: false,
          message: `Carrito con ID ${id} no encontrado`
        }
      } else {
        return {
          success : true ,
          message: "Carrito encontrado",
          carrito: carritoEncontrado
        }
      }    
    } catch (error) {
      console.log("Error al tratar de obtener el carrito por ID", error);  
    }
  }

  async addProductCartById(cartId, productId){
    try {
      const carrito = await this._loadCartsFromFile();
      const productos = await this._loadProductsFromFile();
    
      const carritoEncontrado = carrito.find((c) => c.id === cartId);
      if (!carritoEncontrado) {
        return {
          success: false,
          message:`No existe un carrito con el Id ${cartId}`,
        }
      }

      const productoExistente = productos.find((p) => p.id === productId);
      if (!productoExistente) {
        return {
          success: false,
          message:`No existe un producto con el Id ${productId}`,
        }
      }

      const productoIndex = carritoEncontrado.products.findIndex((p) => p.product === productId);
      if (productoIndex !== -1) {
        carritoEncontrado.products[productoIndex].quantity += 1;
      } else {
        carritoEncontrado.products.push({ product: productId, quantity: 1 });
      }
      await fs.writeFile("carrito.json", JSON.stringify(carrito));
    
      return {
        success: true,
        message: "Producto agregado al carrito"
      }
    } catch (error) {
      console.log("Error al agregar el producto al carrito", error);
    }
  }
}

module.exports = CartManager