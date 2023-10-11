const { cartModel } = require("../models/carts.model");
const { productModel } = require("../models/products.model");

class CartManager{
  constructor() {
    this.carts = [];
  }

  async addNewCart(){
    try {
      const carrito = await cartModel.create({products: []})
      console.log("Carrito creado con éxito", carrito);
    } catch (error) {
      console.log("Error al tratar de crear el carrito", error);
    }
  }

  async getCartById(id){
    try {
      const carrito = await cartModel.find({_id: id}).populate('products.product');
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
      const carrito = await cartModel.findById(cartId).populate('products.product');
      const productos = await productModel.findById(productId)
    
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

  async deleteProductFromCartById(cartId, productId) {
    try {
      const carrito = await cartModel.findById(cartId);
      const productos = await productModel.findById(productId)
    
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
  
      if (!carrito) {
        return {
          success: false,
          message: `No existe un carrito con el Id ${cartId}`,
        };
      }
  
      const productoIndex = carrito.products.findIndex((p) => p.product.toString() === productId);
  
      if (productoIndex !== -1) {
        carrito.products.splice(productoIndex, 1); // Elimina el producto del array
        await carrito.save(); // Guarda la actualización del carrito
        return {
          success: true,
          message: "Producto eliminado del carrito",
        };
      } else {
        return {
          success: false,
          message: `El producto con el Id ${productId} no existe en el carrito`,
        };
      }
    } catch (error) {
      console.log("Error al eliminar el producto del carrito", error);
      return {
        success: false,
        message: "Error al eliminar el producto del carrito",
      };
    }
  }
  
  async updateCartItemQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await cartModel.findById(cartId);
  
      if (!cart) {
        return {
          success: false,
          message: `No se encontró el carrito con el ID ${cartId}`,
        };
      }
  
      const itemIndex = cart.products.findIndex((item) => item.product.toString() === productId);
  
      if (itemIndex !== -1) {
        cart.products[itemIndex].quantity = newQuantity;
        await cart.save();
  
        return {
          success: true,
          message: "Cantidad del producto actualizada en el carrito",
        };
      } else {
        return {
          success: false,
          message: `No se encontró el producto con el ID ${productId} en el carrito`,
        };
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto en el carrito", error);
      return {
        success: false,
        message: "Error al actualizar la cantidad del producto en el carrito",
      };
    }
  }
}

module.exports = CartManager