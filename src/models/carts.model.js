const mongoose = require("mongoose");

const cartCollection = "carts"

const productSchema = new mongoose.Schema({
  product: {type: Number, required: true},
  quantity: {type: Number, required: true},
})

const cartSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  products: [productSchema]
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = { cartModel }