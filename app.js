// app.js
const express = require("express");
const mongoose = require("mongoose");
const productsRouter = require("./routes/productsRouter"); // Upewnij się, że ścieżka do pliku jest poprawna

const app = express();

mongoose
  .connect("mongodb://localhost/warehouse")
  .then(() => {
    console.log("Connected to MongoDB");

    app.use(express.json());
    app.use("/products", productsRouter);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/", (req, res) => {
  res.json({
    endpoints: [
      {
        method: "GET",
        path: "/products",
        description: "Pobiera listę wszystkich produktów",
      },
      { method: "POST", path: "/products", description: "Dodaje nowy produkt" },
      {
        method: "GET",
        path: "/products/:id",
        description: "Pobiera produkt o określonym ID",
      },
      {
        method: "PUT",
        path: "/products/:id",
        description: "Aktualizuje produkt o określonym ID",
      },
      {
        method: "DELETE",
        path: "/products/:id",
        description: "Usuwa produkt o określonym ID",
      },
      // Dodaj tu inne endpointy, które są dostępne w Twojej aplikacji
    ],
  });
});
