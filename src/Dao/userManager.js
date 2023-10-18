const { userModel } = require("../models/usuarios.model")

class ProductManager {
  constructor() {
    this.products = [];
  }


  async getProducts(limit = 10, page = 1) {
    try {
      const options = {
        page: page,
        limit: limit
      }
      const result = await productModel.paginate({}, options)
      const leanProducts = result.docs.map((product) => product.toObject());
      result.docs = leanProducts
      return result;
    } catch (error) {
      console.log("Error al tratar de obtener los productos", error);
    }
  }


  async createUser(dataUser) {
    try {
      const newUser = await userModel.create(dataUser)
      console.log("Usuario creado con exito", newUser);
      return newUser
    } catch (error) {
      console.log("Hubo un error al tratar de crear el usuario", error);
    }
  }

  async getUserByCredencial(email, password) {
    try {
      const user = await userModel.findOne({email, password})

      if(user){
        return user
      } else {
        return null
      }
    } catch (err) {
      throw new Error("Error al obtener el usuario", err);
    }
  }


  async updateProduct(id, updatedFields) {
    try {
      const requiredFields = ["title", "description", "price", "code", "stock", "category"];
      const missingFields = requiredFields.filter((field) => !updatedFields[field]);

      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Faltan campos obligatorios: ${missingFields.join(", ")}`,
        };
      }
      
      // const objectId = mongoose.Types.ObjectId(id);
      const updateData = await productModel.updateOne({ _id: id }, updatedFields);

      // updateData devuelve un objeto si o si pero utilizo .modifieldCount >0 como condicional que si realizo algun cambio
      if (updateData.modifiedCount > 0) {
        return {
          success: true,
          message: "Producto modificado correctamente",
        };
      } else {
        return {
          success: false,
          message: `No se encontró un producto con el ID: ${id}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error al actualizar el producto",
      }
    }
  }
  

  async deleteProduct(id) {
    try {
      
      //Convierto el id en ObjectId para que me lo pueda reconocer ya que si le paso el string me da error
      // const objectId = mongoose.Types.ObjectId(id);
      const product = await productModel.deleteOne({ _id: id });
      console.log(product);

      // product devuelve un objeto y utilizo .deletedCount === 1 como condicional que si realizo elimino el producto
      if (product.deletedCount === 1) {
        return {
          success : true ,
          message:"El producto fue borrado correctamente"
        }
      } else {
          return {
            success :false ,
            message:`No se pudo borrar el producto`
          }
        }
    } catch (err) {
      console.error("Error al eliminar el producto", err);
    }
  }
}

module.exports = ProductManager;
