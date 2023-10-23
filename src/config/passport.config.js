const passport = require("passport")
const local = require("passport-local")
const utils = require("../utils")
const UserManager = require("../Dao/userManager")

const userManager = new UserManager();

const LocalStrategy = local.Strategy;
const initializaPassport = () => {
  passport.use("register", new LocalStrategy(
    {passReqToCallback: true, usernameField:"email"}, async (req, username, password, done) => {
      const {first_name, last_name, email, age, rol} = req.body;
      try {
        const findUser = await userManager.findEmailUser({email: username})
        if(findUser){
          console.log("Usuario ya existe");
          return done(null, false);
        }
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: utils.createHash(password),
          rol
        }
        const user = await userManager.createUser(newUser)
        return done(null, user)
      } catch (error) {
        return done("Error al obtener el usuario: "+ error)
      }
    }))

    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
    passport.deserializeUser( async(id, done) => {
      let user = await userManager.getUserById(id);
      done(null, user);
    })

    passport.use("login", new LocalStrategy({
      usernameField: "email"
    }, async (username, password, done) => {
      try {
        const user = await userManager.findEmailUser({ email: username });
        if (!user) {
          return done(null, false, { message: 'Usuario no existe' });
        }
    
        if (!utils.isValidPassword(user, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
    
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));
    
}

module.exports = initializaPassport