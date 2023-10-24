const mongoose = require("mongoose");

const userCollecion = "users"

const userSchema = new mongoose.Schema({
  first_name: {type: String, max: 30, required: true},
  last_name: {type: String, max: 30,},
  email: {type: String, max: 30, required: true},
  age: {type: Number, required: true},
  password: {type: String, max: 60},
  rol: {type: String, max: 60, required: true},
})

const userModel = mongoose.model(userCollecion, userSchema)

module.exports = { userModel }