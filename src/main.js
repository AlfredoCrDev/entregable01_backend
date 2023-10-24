const express = require("express");
const app = express();
const PORT = 8080;

const { default: mongoose } = require("mongoose");

// Flash para utilizar la funcion req.flash en las rutas
const flash = require("express-flash");

//Multer
const multer = require("multer");

// Rutas
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const handlebars = require("express-handlebars");
const usersRouter = require("./routes/users.router")

// Websockect
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

// ManagerFile
const ProductManager = require("./Dao/productManagerMDB");
const productManager = new ProductManager();
const MessageManager = require("./Dao/messageManager");
const messageManager = new MessageManager();

// Session - File Storage - Cookie parser
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStorage = require("session-file-store");
const MongoStore = require("connect-mongo");

// Passport
const passport = require("passport")
const initializaPassport = require("./config/passport.config")

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuracion handlebars
app.engine("handlebars", handlebars.engine());
//Carpeta de la vista
app.set("views", __dirname + "/views");
//Establecer handlebars como motor de plantilla
app.set("view engine", "handlebars");
//Archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

//Endpoint hbs
app.get("/listadoproductoshb", async (req, res) => {
  let productos = await productManager.getProducts();
  res.render("listadoProductosHB", {
    title: "Productos con Handlebars",
    products: productos,
  });
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render("realTimeProducts", { productos });
  } catch (error) {
    console.error(
      "Error al cargar la vista de productos en tiempo real",
      error
    );
    res
      .status(500)
      .send("Error al cargar la vista de productos en tiempo real");
  }
});

app.get("/messages", async (req, res) => {
  res.render("chat", { title: "CHAT" });
});

app.post("/messages", async (req, res) => {
  const newMessage = {
    user: req.body.usuario,
    message: req.body.mensaje,
  };
  const messages = await messageManager.addMessage(newMessage);
  res.render("confirmacionChat", {
    user: newMessage.user,
    message: newMessage.message,
  });
});

//Socket IO
io.on("connection", (socket) => {
  console.log("Cliente conectado a Socket.io");

  socket.on("agregarProducto", async (nuevoProducto) => {
    const newProducto = await productManager.addProduct(nuevoProducto);

    // Emitiendo un evento para actualizar la lista en el cliente.
    io.emit("productoAgregado", newProducto);
  });

  socket.on("eliminarProducto", async (productoId) => {
    await productManager.deleteProduct(parseInt(productoId));

    // Emitiendo un evento para actualizar la lista en el cliente.
    io.emit("productoEliminado", productoId);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado de Socket.io");
  });
});

// Config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    cb(null, `${timestamp}-${originalName}`);
  },
});
const upload = multer({ storage });

//Ruta para manejar la subida del archivo
app.post("/upload", upload.single("archivo"), (req, res) => {
  res.json({ message: "Archivo subido exitosamente" });
});

app.get("/upload", async (req, res) => {
  res.render("fileUpload", { title: "Subir archivo" });
});

// Configurando session local
// const fileStorage = FileStorage(session)
// app.use(cookieParser())
// app.use(session({
//   store: new fileStorage({path: "./session", ttl:100, retries: 0}),
//   secret: 'asdasd',
//   resave: true,
//   saveUninitialized: false
// }))

// Configurando session con MongoDB y MongoAtlas
app.use(cookieParser())
app.use(session({
  store:MongoStore.create({
    mongoUrl: "mongodb+srv://alfredocrdev:123456coder@clustercoder.ypebzyg.mongodb.net/?retryWrites=true&w=majority",
    mongoOptions:{useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 150
  }),
  secret: 'qweasdzxc',
  resave: true,
  saveUninitialized: true
}))
 
// Middleware para usar Flash y enviar mensajes con la funcion req.flash
app.use(flash());

// Inicializamos passport
initializaPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", usersRouter)

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el Puerto ${PORT}`);
});

mongoose
  .connect(
    "mongodb+srv://alfredocrdev:123456coder@clustercoder.ypebzyg.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conectado a la Base de Datos");
  })
  .catch((error) => {
    console.log(
      "Hubo un Error al tratar de conectarse a la Base de Datos",
      error
    );
  });
