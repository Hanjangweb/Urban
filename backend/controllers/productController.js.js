const Product = require("../models/Product");

// CREATE PRODUCT (ADMIN)
const createProduct = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const product = new Product({
      ...req.body,
      user: req.user._id, // ✅ VERY IMPORTANT
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      message: "Server error while creating product",
      error: error.message
    });
  }
};

module.exports = { createProduct };