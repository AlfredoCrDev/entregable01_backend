const express = require("express");
const app = express();
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const handlebars = require("express-handlebars")

// Websockect
const http = require("http");
const socketIo = require("socket.io");
const path = require("path")
const { Server } = require("socket.io")
const server = http.createServer(app);
const io = new Server(server);

const ProductManager = require("./productManager")
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuracion handlebars
app.engine("handlebars", handlebars.engine())
//Carpeta de la vista
app.set("views", __dirname + "/views")
//Establecer handlebars como motor de plantilla
app.set("view engine", "handlebars")
//Archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, "public")))

//Endpoint hbs
app.get("/", async (req, res) => {
    let productos = await productManager.getProducts()
    res.render("home", {
        title : "Productos con Handlebars",
        products: productos
    })
})

app.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("realTimeProducts", { productos });
    } catch (error) {
        console.error("Error al cargar la vista de productos en tiempo real", error);
        res.status(500).send("Error al cargar la vista de productos en tiempo real");
    }
});

//Socket IO
io.on("connection", (socket) => {
    console.log("Cliente conectado a Socket.io");

    socket.on("agregarProducto", async (nuevoProducto) => {
    
        await productManager.addProduct(nuevoProducto)

        // Emitiendo un evento para actualizar la lista en el cliente.
        io.emit("productoAgregado", nuevoProducto);

    });
    socket.on("disconnect", () => {
        console.log("Cliente desconectado de Socket.io")
    })
});



app.use("/api", productsRouter)
app.use("/api", cartsRouter)

const PORT = 8080;
server.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el Puerto ${PORT}`);
})