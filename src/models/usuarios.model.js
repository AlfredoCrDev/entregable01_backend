const mongoose = require("mongoose");

const userCollecion = "users"

const userSchema = new mongoose.Schema({
  first_name: {type: String, max: 30},
  last_name: {type: String, max: 30},
  email: {type: String, max: 30},
  age: {type: Number},
  password: {type: String, max: 60},
  rol: {type: String, max: 60},
})

const userModel = mongoose.model(userCollecion, userSchema)

module.exports = { userModel }
