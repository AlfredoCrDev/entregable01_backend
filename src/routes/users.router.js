const express = require("express");
const UserManager = require("../Dao/userManager")
const CartManager = require("../Dao/cartManagerMDB")
const utils = require("../utils")
const passport = require("passport")


const router = express.Router()

const userManager = new UserManager();
const cartManager = new CartManager();

router.get("/current", utils.authToken, (req, res) =>{
  res.send({status:"success", payload:req.user})
})

// TRABAJANDO CON JWT
router.post("/jwt/register", async (req,res) =>{
  const {first_name, last_name, email, age, password, rol} = req.body;
    try {
      const findUser = await userManager.findEmailUser({email: email})
      if(findUser){
        console.log("Usuario ya existe");
        return res.status(400).send({status: "error", message: "Usuario ya existe" });
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: utils.createHash(password),
        cart: cartManager.addNewCart(),
        rol
      }
      const user = await userManager.createUser(newUser)
      let token = utils.generateToken(user);
      res.json({status: "success", token});
      console.log("Este es el Token: ", token);
  } catch (error) {
    console.log("Error al crear al usuario: ", error); 
  }
})

router.post('/jwt/login', passport.authenticate('login', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      const token = utils.generateToken(user);
      res.cookie("token", token, {httpOnly: true, maxAge: 60*60*1000})
      res.json({ status: 'success', user, token });
    } else {
      res.status(403).json({ status: 'error', message: 'Acceso prohibido. Credenciales incorrectas.' });
    }
  } catch (error) {
    console.log('Error al tratar de hacer login:', error);
    res.status(500).json({ status: 'error', message: 'Se ha producido un error inesperado' });
  }
});


// //TRABAJANDO CON SESSION
// router.post("/api/sessions/register", passport.authenticate("register", {
//   failureRedirect: "/faillogin",
//   //failureFlash se utiliza para habiliater los mensajes que se envian desde las estrategias
//   failureFlash: true}), async (req, res) => {
//   try {
//     // Verificacion Postman
//     // const requiredProperties = ['first_name', 'last_name', 'email', 'age', 'password', 'rol'];

//     // Verifica si todas las propiedades requeridas están presentes en req.body
//     // const missingProperties = requiredProperties.filter(prop => !(prop in req.body));

//     // if (missingProperties.length > 0) {
//     //   return res.status(400).send({ message: `Faltan propiedades requeridas: ${missingProperties.join(', ')}` });
//     // }

//     // Ya esto se realiza en las estrategias de Passport
//     // const newUser = {
//     //   first_name: req.body.first_name,
//     //   last_name: req.body.last_name,
//     //   email: req.body.email,
//     //   age: req.body.age,
//     //   password: utils.createHash(req.body.password),
//     //   rol: req.body.rol
//     // }
  
//     // const user = await userManager.createUser(newUser)
//     // if(user){
//     //   return res.redirect("/api/sessions/login")
//     // } else {
//     //   throw Error('Error al crear el usuario')
//     // }

//     // Mensjae Postman solo se puede hacer un envío
//     // res.status(200).send({message: "Usuario creado con Éxito", user})

//     res.redirect("/")
//   } catch (error) {
//     console.log("Error al crear el usuario", error);
//   }
// })

// router.get("/failregister", async(req, res) => {
//   const errorMessage = req.flash("error")[0];
//   res.render("faillogin", {message: errorMessage})
// })

// router.post("/api/sessions/login", passport.authenticate("login", {
//   failureRedirect:"/faillogin",
//   failureFlash: true}) ,async (req, res) => {
//   try {
//     // const username = req.body.username
//     // const password = req.body.password

//     // const user = await userManager.getUserByCredencial(username, password)
//     const user = req.user
//     if(user){

//       if(user.rol === "admin") {
//         req.session.email = user.email
//         req.session.nombre = user.first_name
//         req.session.apellido = user.last_name
//         req.session.age = user.age
//         req.session.rol = user.rol
//         res.redirect("/profile")
//       } else {
//         req.session.nombre = user.first_name
//         req.session.email = user.email
//         req.session.rol = user.rol
//         res.redirect("/products")
//       }
//       }else{
//         res.status(403).render("failLogin", { message: "Acceso prohibido. Credenciales incorrectas." });
//     }
//   } catch (error) {
//     console.log("Error al trarar de hacer login");
//     res.status(500).render("faillogin", { message: "Se ha producido un error inesperado" });
//   }
// })

router.get("/faillogin", (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render("faillogin", {message: errorMessage})
})

router.get("/api/sessions/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/");
  });
});

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async(req,res) =>{})

router.get("/api/sessions/githubcallback", passport.authenticate("github", {
  failureRedirect:"/faillogin"}), async(req,res) =>{
    req.session.user = req.user;
    req.session.nombre = req.session.user.first_name
    req.session.apellido = req.session.user.last_name
    req.session.age = req.session.user.age
    req.session.email = req.session.user.email
    req.session.rol = req.session.user.rol
    res.redirect("/profile")
  })

// Vistas Handlebars
router.get("/", async(req, res) => {
  try {
    
    res.render("login", { title: "Inicio de Sesion" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
  }
})

router.get("/register", async(req, res) => {
  try {
    
    res.render("register", { title: "Registro de Usuario" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
  }
})

router.get("/profile", utils.passportCall("jwt"), utils.authorization("admin") ,async(req, res) => {
  try {
    const user = req.user.user;
    if(!user){
      console.log("No esta autorizado");
      return res.redirect("/")
    }
      const sessionData = {
        email: user.email,
        nombre: user.first_name,
        apellido: user.last_name,
        age: user.age || "No especifica",
        rol: user.rol,
      }
      res.render("profile", { title: "Perfil de Usuario", sessionData });
  } catch (error) {
    console.log("Error al tratar de mostrar el perfil de usuario", error);
  }
})

// router.get("/profile", async(req, res) => {
//   try {
//     if(!req.session.email){
//       return res.redirect("/")
//     }
//     const sessionData = {
//       email: req.session.email,
//       nombre: req.session.nombre,
//       apellido: req.session.apellido,
//       age: req.session.age,
//       rol: req.session.rol,
//     };
    
//     res.render("profile", { title: "Perfil de Usuario", sessionData })
//   } catch (error) {
//     console.log("Error al tratar de mostrar el perfil de usuario", error);
//   }
// })

module.exports = router