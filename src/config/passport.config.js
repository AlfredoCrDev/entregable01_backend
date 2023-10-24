const passport = require("passport")
const local = require("passport-local")
const utils = require("../utils")
const UserManager = require("../Dao/userManager")
const git = require("passport-github2")

const userManager = new UserManager();

const LocalStrategy = local.Strategy;
const GitHubStrategy = git.Strategy;
const initializaPassport = () => {
  passport.use("register", new LocalStrategy(
    {passReqToCallback: true, usernameField:"email"}, async (req, username, password, done) => {
      const {first_name, last_name, email, age, rol} = req.body;
      try {
        const findUser = await userManager.findEmailUser({email: username})
        if(findUser){
          console.log("Usuario ya existe");
          return done(null, false, { message: "Usuario ya existe" });
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
        return done(null, user, { message: "Usuario creado con éxito. Ya puedes iniciar Sesión" })
      } catch (error) {
        return done(error)
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

    passport.use("github", new GitHubStrategy({
      clientID: "Iv1.87770ef1b11e26a7",
      clientSecret: "91408936f2bfb29d9c6b219bdeab1b4a5c623424",
      callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let user = await userManager.findEmailUser({email:profile._json.email})
        if(!user){
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: 18,
            password: "",
            rol: "admin"
        }
        let result = await userManager.createUser(newUser)
        done(null, result)
      } else {
        done(null, user);
      }
      } catch (error) {
        return done(error)
      }
    }))
    
}

module.exports = initializaPassport