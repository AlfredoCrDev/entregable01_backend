class ProductManager {

    constructor(){
        this.products = []
    }

    getProducts(){
        return this.products
    }

    addProduct(title, description, price, thumbnail, code, stock){

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
        return this.products.push(product)
    }

    getProductById(id){
        const productoId = this.products.find((product => product.id === id))

        if(!productoId){
            console.error(`No existe ningun producto con el ID: ${id}`)
        } else {
            return productoId;
        }
    }

}

const productManager = new ProductManager()
productManager.addProduct("Azucar Blanca", "Azucar blanca refinada 1kg", 1000, "", "azu01", 7)
productManager.addProduct("Azucar Morena", "Azucar Morena refinada 1kg", 900, "", "azu02", 6)
productManager.addProduct("Sal Gruesa", "Sal gruesa refinada 1kg", 800, "", "sal01", 11)
productManager.addProduct("Mantequilla", "Mantequillas sin sal 250gr", 1500, "", "mant01", 11)
productManager.addProduct("Queso Azul", "Trozos de queso azul de 250gr", 3000, "", "ques01", 11)
// productManager.addProduct("Sal Gruesa", "Sal gruesa refinada", 800, "", "sal01", 11)

const productos = productManager.getProducts()
// console.log(productos)

const buscarPorid = productManager.getProductById(10)
console.log(buscarPorid)