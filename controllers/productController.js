const Product = require("../models/productModel");

exports.addProduct = (req, res) => {
  Product.addProduct(req.body, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product added successfully" });
  });
};

exports.getProducts = (req, res) => {
  Product.getAllProducts((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};
