const express = require("express");
const app = express();
const PORT = 8080;

const { default: mongoose } = require("mongoose")

//Multer
const multer = require("multer")

// Rutas
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

// ManagerFile
const ProductManager = require("./Dao/productManagerMDB")
const productManager = new ProductManager();
const MessageManager = require("./Dao/messageManager")
const messageManager = new MessageManager();

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

app.get("/messages", async (req, res) => {
    res.render("chat", {title: "CHAT"})
})

app.post("/messages", async (req, res) => {
  const newMessage = {
  user: req.body.usuario,
  message: req.body.mensaje
  }
  const messages = await messageManager.addMessage(newMessage)
  res.render("confirmacionChat", { user: newMessage.user , message: newMessage.message })
})

//Socket IO
io.on("connection", (socket) => {
    console.log("Cliente conectado a Socket.io");

    socket.on("agregarProducto", async (nuevoProducto) => {
    
        const newProducto = await productManager.addProduct(nuevoProducto)

        // Emitiendo un evento para actualizar la lista en el cliente.
        io.emit("productoAgregado", newProducto);

    });

    socket.on("eliminarProducto", async (productoId) => {
        await productManager.deleteProduct(parseInt(productoId))

        // Emitiendo un evento para actualizar la lista en el cliente.
        io.emit("productoEliminado", productoId);

    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado de Socket.io")
    })
});

// Config Multer
const storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"))
  },
  filename: (req, file, cb) =>{
    const timestamp = Date.now()
    const originalName = file.originalname
    const ext = path.extname(originalName)
    cb(null, `${timestamp}-${originalName}`)
  }
})
const upload = multer({storage})

//Config el html de la carpeta public
// app.use(express.static(path.join(__dirname, "public")))

//Ruta para manejar la subida del archivo
app.post("/upload", upload.single("archivo"), (req, resp) => {
  resp.json({message: "Archivo subido exitosamente"})
})


app.use("/", productsRouter)
app.use("/", cartsRouter)

server.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el Puerto ${PORT}`);
})

mongoose.connect("mongodb+srv://alfredocrdev:123456coder@clustercoder.ypebzyg.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la Base de Datos");
    })
    .catch(error => {
        console.log('Hubo un Error al tratar de conectarse a la Base de Datos', error)
    })
