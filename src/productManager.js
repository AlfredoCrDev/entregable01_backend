const fs = require("fs/promises");

class ProductManager {
  constructor() {
    this.products = [];
  }

  async _loadProductsFromFile() {
    try {
      const data = await fs.readFile("productos.json", "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProducts() {
    const products = await this._loadProductsFromFile();
    return products;
  }

  async addProduct(productosParaAgregar) {
    try {
      if(productosParaAgregar.id){
        return "No se puede agregar ID manual"
      }

      if (!productosParaAgregar.status) {
        productosParaAgregar.status = true;
      }
      
      if (
        !productosParaAgregar.title ||
        !productosParaAgregar.description ||
        !productosParaAgregar.price ||
        !productosParaAgregar.stock ||
        !productosParaAgregar.category ||
        !productosParaAgregar.code
      ) {
        return ("Faltan propiedades obligatorias. (title, description, price, stock, status, category, code) ");
      }


      const productoExistente = await this._loadProductsFromFile();
      const productosAgregados = [];

      const productoExiste = productoExistente.some((producto) => {
        return producto.code === productosParaAgregar.code
      })

      if(productoExiste){
        console.error(`El código "${productosParaAgregar.code}" ya existe`)
        return
      }

      const id = productoExistente.length + 1;
      const newProduct = { id, ...productosParaAgregar };
      productoExistente.push(newProduct);
      productosAgregados.push(newProduct);

      await fs.writeFile("productos.json", JSON.stringify(productoExistente));

      if (productosAgregados.length > 0) {
        console.log("Productos guardados con éxito:", productosAgregados);
        return newProduct
      } else {
        console.log("No se ha agregado ningún producto nuevo.");
      }
    } catch (error) {
      console.error("Error al agregar productos:", error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this._loadProductsFromFile();

      const product = products.find((item) => item.id === id);

      if (product) {
        return product;
      } else {
        return `No existe un producto con el ID: ${id}`;
      }
    } catch (err) {
      throw new Error("Error al obtener el producto por ID", err);
    }
  }

  async updateProduct(id, updatedFields) {
    const allowedFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
      "status",
      "category"
    ];

    try {
      const products = await this._loadProductsFromFile();

      const productIndex = products.findIndex((item) => item.id === id);

      if (productIndex !== -1) {
        const updatedProduct = {
          ...products[productIndex],
          ...updatedFields,
          id,
        };

        for (const field in updatedFields) {
          if (allowedFields.includes(field)) {
            updatedProduct[field] = updatedFields[field];
          }
        }

        products[productIndex] = updatedProduct;

        await fs.writeFile("productos.json", JSON.stringify(products));

        console.log("Producto actualizado con éxito!");
      } else {
        throw new Error(`No existe un producto con el ID: ${id}`);
      }
    } catch (err) {
      throw new Error("Error al actualizar el producto", err);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this._loadProductsFromFile();

      const productIndex = products.findIndex((item) => item.id === id);

      if (productIndex !== -1) {
        products.splice(productIndex, 1);

        await fs.writeFile("productos.json", JSON.stringify(products));

        console.log("Producto eliminado con éxito!");
      } else {
        throw new Error(`No existe un producto con el ID: ${id}`);
      }
    } catch (err) {
      throw new Error("Error al eliminar el producto", err);
    }
  }
}

// (async () => {
//     try {
//         const productManager = new ProductManager();
//         const productosParaAgregar = [
//             {title: "Azucar Blanca", description: "Azucar blanca refinada 1kg", price: 1000, thumbnail: "", code: "azu01", stock: 7},
//             {title: "Azucar Morena", description: "Azucar Morena refinada 1kg", price: 900, thumbnail: "", code: "azu02", stock: 6},
//             {title: "Sal Gruesa", description: "Sal gruesa refinada 1kg", price: 800, thumbnail: "", code: "sal01", stock: 11},
//             {title: "Mantequilla", description: "Mantequillas sin sal 250gr", price: 1500, thumbnail: "", code: "mant01", stock: 11},
//             {title: "Queso Azul", description: "Trozos de queso azul de 250gr", price: 3000, thumbnail: "", code: "ques01", stock: 11},
//             {title: "Sal Gruesa", description: "Sal gruesa refinada", price: 800, thumbnail: "", code: "sal01", stock: 11}
//         ]

//         await productManager.addProduct(productosParaAgregar);

//     } catch (error) {
//         console.error("Error", error);
//     }
// })();

module.exports = ProductManager;
