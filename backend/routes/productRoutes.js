const express = require('express')
const Product = require("../models/Product")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()


//@route POST /API/products
//@desc Create a new Product
//@access Private/admin
router.post("/", protect, admin, async (req, res) => {
    console.log("AUTH HEADER:", req.headers.authorization)
    console.log("USER:", req.user)
    console.log("BODY:", req.body)
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimentions,
            weight,
            sku
        } = req.body

        // const product = new Product({
        //     name,
        //     description,
        //     price,
        //     discountPrice,
        //     countInStock,
        //     category,
        //     brand,
        //     sizes,
        //     colors,
        //     collections,
        //     material,
        //     gender,
        //     images,
        //     isFeatured,
        //     isPublished,
        //     tags,
        //     dimentions,
        //     weight,
        //     sku,
        //     user: req.user._id //Reference to admin
        // })
        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,

            //FIXED REQUIRED FIELDS
            sizes: sizes && sizes.length ? sizes : ["M"],
            colors: colors && colors.length ? colors : ["Black"],
            collections: collections || "Default",
            material: material || "Cotton",

            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimentions,
            weight,
            sku,
            user: req.user._id
        })
        const createdProduct = await product.save()
        console.log("USER FROM TOKEN:", req.user)
        res.status(201).json(createdProduct)
        console.log("USER FROM TOKEN:", req.user)
    } catch (err) {
        console.error("Detailed Save Error:", err);
        res.status(500).json({
            message: "Failed to save product",
            error: err.message, 
            stack: process.env.NODE_ENV === 'development' ? err.stack : null
        });
    }
})
//@route PUT /API/products/:id
//@desc Update on existing product id
//@access Private/admin
router.put("/:id", protect, admin, async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimentions,
            weight,
            sku
        } = req.body

        // find product by ID
        const product = await Product.findById(req.params.id)

        if (product) {
            // Update product fields
            product.name = name || product.name
            product.description = description || product.description
            product.price = price || product.price
            product.discountPrice = discountPrice || product.discountPrice
            product.countInStock = countInStock || product.countInStock
            product.category = category || product.category
            product.brand = brand || product.brand
            product.sizes = sizes || product.sizes
            product.colors = colors || product.colors
            product.collections = collections || product.collections
            product.material = material || product.material
            product.gender = gender || product.gender
            product.images = images || product.images
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished
            product.tags = tags || product.tags
            product.dimentions = dimentions || product.dimentions
            product.weight = weight || product.weight
            product.sku = sku || product.sku

            // Save the product
            const updatedProduct = await product.save()
            res.json(updatedProduct)
        } else {
            res.status(404).json({ message: "Product.found" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

//@route DELETE /API/products/:id
//@desc delete  product id
//@access Private/admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product ID
        const product = await Product.findById(req.params.id)

        if (product) {
            // Remove the product from db
            await product.deleteOne()
            res.json({ message: "Product removed" })
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "server error" })
    }
})

//@route GET /API/products
//@desc get all products with optional query filter
//@access Private/admin
router.get("/", async (req, res) => {
    try {
        const {
            category,
            brand,
            size,
            color,
            collection,
            material,
            gender,
            limit,
            minPrice,
            maxPrice,
            sortBy,
            search
        } = req.query

        let query = {}

        // Filter logic
        if (collection && collection.toLocaleLowerCase() !== "all") {
            query.collections = collection
        }
        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category
        }
        if (material) {
            query.material = { $in: material.split(",") }
        }
        if (brand) {
            query.brand = { $in: brand.split(",") }
        }
        if (size) {
            query.sizes = { $in: size.split(",") }
        }
        if (color) {
            query.colors = { $in: [color] }
        }
        if (gender) {
            query.gender = gender
        }
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        // Sort logic
        let sort = {}
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 }
                    break;
                case "priceDesc":
                    sort = { price: -1 }
                    break
                case "popularity":
                    sort = { rating: -1 }
                    break
                default:
                    break
            }
        }

        // Fetch product and apply sorting and limit 
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0)
        res.json(products);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})
//@route GET /API/products/New arrival
//@desc Retrieve new arrival
//@access access public
router.get("/new-arrival", async (req, res) => {
    try {
        // Fetch latest 8 product
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8)
        res.json(newArrivals)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

//@route GET /API/products/best-seller
//@desc Retrieve best seller
//@access access public
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 })
        if (bestSeller) {
            res.json(bestSeller)
        } else {
            res.status(404).json({ message: "No best seller found" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// single product route
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})


//@route GET /API/products/similar/id
//@desc Retrieve similar product base on the current product gernde etc
//@access access public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params

    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category
        }).limit(5)
        res.json(similarProducts)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})


module.exports = router