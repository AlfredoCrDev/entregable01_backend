const fs = require("fs/promises")

class ProductManager {

    constructor(){
        this.products = []
    }

    async _loadProductsFromFile(){
        const data = await fs.readFile("productos.json", "utf-8");
        return JSON.parse(data);
    }

    async getProducts(){
        const products = await this._loadProductsFromFile();
        return products
    }

    async addProduct(title, description, price, thumbnail, code, stock){

        try {
            const productoExistente = this.products.find(product => product.code === code);
    
            if (productoExistente) {
                return console.error(`El código "${code}" ya esta siendo utilizado por el producto "${title}".`);
            }
            const id_producto = this.products.length +1
            const product ={
                id: id_producto,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            this.products.push(product)
            await fs.writeFile(`productos.json`, JSON.stringify(this.products))
            console.log("Producto guardado con éxito!!!");
        } catch (error) {
            console.log("Error al guardar el producto en el archivo");
        }

    }

    async getProductById(id){
        try {
            const products = await this._loadProductsFromFile();
            
            const product = products.find(item => item.id === id);
            
            if (product) {
                return product;
            } else {
                return (`No existe un producto con el ID: ${id}`);
            }
            } catch (err) {
            throw new Error("Error al obtener el producto por ID", err);
        }
    }

    async updateProduct(id, updatedFields){
        const allowedFields = ["title", "description", "price", "thumbnail", "code", "stock"];

        try {
            const products = await this._loadProductsFromFile();
            
            const productIndex = products.findIndex(item => item.id === id);
            
            if (productIndex !== -1) {
                const updatedProduct = {
                    ...products[productIndex],
                    ...updatedFields,
                    id
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

    async deleteProduct(id){
        try {
            const products = await this._loadProductsFromFile();;
            
            const productIndex = products.findIndex(item => item.id === id);
            
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


(async () => {
    try {
        const productManager = new ProductManager();
        await productManager.addProduct("Azucar Blanca", "Azucar blanca refinada 1kg", 1000, "", "azu01", 7)
        await productManager.addProduct("Azucar Morena", "Azucar Morena refinada 1kg", 900, "", "azu02", 6)
        await productManager.addProduct("Sal Gruesa", "Sal gruesa refinada 1kg", 800, "", "sal01", 11)
        await productManager.addProduct("Mantequilla", "Mantequillas sin sal 250gr", 1500, "", "mant01", 11)
        await productManager.addProduct("Queso Azul", "Trozos de queso azul de 250gr", 3000, "", "ques01", 11)
        await productManager.addProduct("Sal Gruesa", "Sal gruesa refinada", 800, "", "sal01", 11)

        // const buscarPorid = await productManager.getProductById(5);
        // console.log(buscarPorid);

        // const productos = await productManager.getProducts();
        // console.log(productos);

        // const modificacionProducto = {
        //     title: 'Azucar Blanca',
        //     description: 'Azucar blanca refinada 500gr',
        //     price: 800,
        //     thumbnail: '',
        //     code: 'azu02',
        //     stock: 19
        // }

        // const update = await productManager.updateProduct(1, modificacionProducto)
        // console.log(update);

        // const borrarProducto = await productManager.deleteProduct(1);
        // console.log(borrarProducto);


    } catch (error) {
        console.error("Error", error);
    }
})();
