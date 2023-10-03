const mongoose = require("mongoose");

const productCollecion = "products"

const productSchema = new mongoose.Schema({
  title: {type: String, max: 30, required: true},
  description: {type: String, max: 60, required: true},
  price: {type: Number, required: true},
  stock: {type: Number, required: true},
  category: {type: String, max: 15, required: true},
  code: {type: String, max: 10, required: true},
  status: {type: Boolean},
})

const productModel = mongoose.model(productCollecion, productSchema)

module.exports = { productModel }