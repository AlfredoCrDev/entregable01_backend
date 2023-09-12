const express = require("express");
const app = express();
const ProductManager = require("./productManager")


app.use(express.urlencoded({extended: true}));

const productManager = new ProductManager();


app.get("/products/", async (req, res) =>{
    try {
        const limite = req.query.limit;
        // const productManager = new ProductManager();
        const products = await productManager.getProducts();

        if (!limite) {
            res.json(products);
        } else {
            const limiteNum = parseInt(limite);

            if (!isNaN(limiteNum)) {
                const limitedProducts = products.slice(0, limiteNum);
                res.json(limitedProducts);
            } else {
                res.status(400).json({ error: 'El parámetro "limit" no es un número válido.' });
            }
        }
    } catch (error) {
        console.log('Error', error);
    }
})

app.get("/product/:id", async (req, res) =>{
    try{
        const productId = parseInt(req.params.id);
        // const productManager = new ProductManager();
        const product= await productManager.getProductById(productId);
        res.send({producto : product});
        }catch(error){
            console.log('Error', error);
    }
})

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el Puerto ${PORT}`);
})