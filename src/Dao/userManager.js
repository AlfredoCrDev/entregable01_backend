const { userModel } = require("../models/usuarios.model")

class UserManager {
  constructor() {
    this.products = [];
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
      // Ya no se pregunta por el password en la bdd ya que es un dato sensible
      // const user = await userModel.findOne({email, password})

      const user = await userModel.findOne({email:email}, {email: 1, first_name:1, last_name: 1, password: 1})
      console.log(user);
      if(user){
        return user
      } else {
        return null
      }
    } catch (err) {
      throw new Error("Error al obtener el usuario", err);
    }
  }

  async findEmailUser (email) {
    try {
      const user = await userModel.findOne(email)
      if(user){
        return user
      } else {
        return null
      }
    } catch (err) {
      throw new Error("Error al obtener el usuario", err);
    }
  }

  async getUserById(id) {
    try {
      const user = await userModel.find({_id: id})

      if (user) {
        return user;
      } else {
        return `No existe un usuario con el ID: ${id}`;
      }
    } catch (err) {
      throw new Error("Error al obtener el usuario por ID", err);
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

module.exports = UserManager;
