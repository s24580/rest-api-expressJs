const mongoose = require("mongoose");

// Definicja schematu produktu
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Zapewnia unikalność nazwy produktu
    trim: true, // Usuwa białe znaki z początku i końca
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Zapewnia, że cena nie będzie ujemna
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, // Zapewnia, że ilość nie będzie ujemna
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
});

// Tworzenie modelu na podstawie schematu
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
