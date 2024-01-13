const express = require("express");
const router = express.Router();
const Product = require("../models/Product.js"); // Załóżmy, że models/Product.js znajduje się w folderze 'models'

// GET - Pobieranie produktów z filtrowaniem i sortowaniem
router.get("/", async (req, res) => {
  try {
    let query = Product.find();

    // Filtrowanie
    if (req.query.name) {
      query = query.regex("name", new RegExp(req.query.name, "i"));
    }
    if (req.query.minPrice) {
      query = query.gte("price", parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      query = query.lte("price", parseFloat(req.query.maxPrice));
    }
    if (req.query.quantity) {
      query = query.where("quantity", parseInt(req.query.quantity));
    }

    // Sortowanie
    if (req.query.sortBy) {
      let sortOrder = req.query.sortOrder === "desc" ? "-" : "";
      query = query.sort(sortOrder + req.query.sortBy);
    }

    const products = await query.exec();
    res.json(products);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// POST - Dodawanie nowego produktu
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// PUT - Aktualizacja istniejącego produktu
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    res.json(updatedProduct);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE - Usuwanie istniejącego produktu
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send("Product deleted");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/report", async (req, res) => {
  try {
    const report = await Product.aggregate([
      {
        $group: {
          _id: "$name", // Grupowanie według nazwy produktu
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      {
        $project: {
          _id: 0, // Usunięcie pola _id z wyniku
          name: "$_id", // Przemianowanie _id na nazwę produktu
          totalQuantity: 1,
          totalValue: 1,
        },
      },
    ]);

    res.json(report);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
