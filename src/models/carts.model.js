const mongoose = require("mongoose");

const cartCollection = "carts"

const productSchema = new mongoose.Schema({
  product: {type: String },
  quantity: {type: Number },
})

const cartSchema = new mongoose.Schema({
  products: [productSchema]
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = { cartModel }