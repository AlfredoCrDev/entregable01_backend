const express = require("express");
const app = express();
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api", productsRouter)
// app.use("/api", cartsRouter)

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el Puerto ${PORT}`);
})