const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")

const PRIVATE_KEY = "TokenSecretoAppAlfredo"

/* 
1er argumento objeto con la info
2do argumento es la llave privada
3er argumento tiempo de expiracion
*/
const generateToken = (user) => {
  const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "1h"})
  return token
}

const authToken = (req, res, next) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({
      error: "Not authenticated - No hay headers porque no hay token"
    })
  }
  const token = authHeader.split(" ")[1]
  jwt.verify(token, PRIVATE_KEY, (error, credentials) =>{
    if(error){
      return res.status(403).send({
        error: "Not authorized"
      })
    }
    req.user = credentials.user
    next();
  })
}

const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send({ error: info.message || info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}

const authorization = (role) => {
  return (req, res, next) => {
    const user = req.user.user
    console.log(user);
    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    if (user.rol != role) { // Usar req.user.rol para acceder al rol del usuario
      return res.status(403).send({ error: `No tienes permisos para acceder` });
    }
    next();
  }
}

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  authToken,
  passportCall,
  authorization
}