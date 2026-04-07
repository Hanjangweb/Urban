const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const { protect, admin } = require("../middleware/authMiddleware")

// GET /api/admin/products — get all products
router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
})

// POST /api/admin/products — create new product
router.post("/", protect, admin, async (req, res) => {
    try {
        const product = new Product(req.body)
        const saved = await product.save()
        res.status(201).json(saved)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
})

// PUT /api/admin/products/:id  ✅ THIS WAS MISSING — causes your 404
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        // Update all fields from request body
        const {
            name, description, price, discountPrice,
            countInStock, sku, category, brand,
            sizes, colors, collections, material,
            gender, images
        } = req.body

        product.name        = name        ?? product.name
        product.description = description ?? product.description
        product.price       = price       ?? product.price
        product.discountPrice = discountPrice ?? product.discountPrice
        product.countInStock = countInStock ?? product.countInStock
        product.sku         = sku         ?? product.sku
        product.category    = category    ?? product.category
        product.brand       = brand       ?? product.brand
        product.sizes       = sizes       ?? product.sizes
        product.colors      = colors      ?? product.colors
        product.collections = collections ?? product.collections
        product.material    = material    ?? product.material
        product.gender      = gender      ?? product.gender
        product.images      = images      ?? product.images  // ✅ saves Cloudinary URLs

        const updated = await product.save()
        res.json(updated)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// DELETE /api/admin/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        await product.deleteOne()
        res.json({ message: "Product deleted" })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router