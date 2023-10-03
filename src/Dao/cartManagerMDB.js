const { cartModel } = require("../models/carts.model");
const { productModel } = require("../models/products.model");

class CartManager{
  constructor() {
    this.carts = [];
  }

  async addNewCart(){
    try {
      const carrito = await cartModel.create()
      console.log("Carrito creado con éxito", carrito);
    } catch (error) {
      console.log("Error al tratar de crear el carrito", error);
    }
  }

  async getCartById(id){
    try {
      const carrito = await cartModel.find({_id: id})
      if (!carrito) {
        return {
          success: false,
          message: `Carrito con ID ${id} no encontrado`
        }
      } else {
        return {
          success : true ,
          message: "Carrito encontrado",
          carrito: carrito
        }
      }    
    } catch (error) {
      console.log("Error al tratar de obtener el carrito por ID", error);  
    }
  }

  async addProductCartById(cartId, productId){
    try {
      const carrito = await cartModel.find({_id: cartId});
      const productos = await productModel.find({_id: productId})
    
      if (!carrito) {
        return {
          success: false,
          message:`No existe un carrito con el Id ${cartId}`,
        }
      }

      if (!productos) {
        return {
          success: false,
          message:`No existe un producto con el Id ${productId}`,
        }
      }

      const productoIndex = carrito.products.findIndex((p) => p.product.toString() === productId);
      if (productoIndex !== -1) {
        carrito.products[productoIndex].quantity += 1;
      } else {
        carrito.products.push({ product: productId, quantity: 1 });
      }
    
      await carrito.save();
      
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