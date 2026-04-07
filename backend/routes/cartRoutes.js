const express = require('express')
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

// Helper function to get a cart by user id or guest id
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId })
    }
    return null
}

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access public
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body
    const userId = req.user._id

    try {
        const guestCart = await Cart.findOne({ guestId })
        const userCart = await Cart.findOne({ user: userId })

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(404).json({ message: "Guest cart not found" })
            }
            if (userCart) {
                // Merge guest products into user cart
                guestCart.products.forEach((guestItem) => {
                    const existingIndex = userCart.products.findIndex(
                        (p) =>
                            p.productId.toString() === guestItem.productId.toString() &&
                            p.size === guestItem.size &&
                            p.color === guestItem.color
                    )

                    if (existingIndex > -1) {
                        userCart.products[existingIndex].quantity += guestItem.quantity
                    } else {
                        userCart.products.push(guestItem)
                    }
                })

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                )

                await userCart.save()
                // remove the guest cart after merging
                try{
                    await Cart.findOneAndDelete({ guestId }) // remove guest cart
                }catch(err){
                    console.error(err)
                    res.status(500).json({message: "Server error"})
                }
                return res.status(200).json(userCart)

            } else {
                // No user cart — reassign guest cart to user
                guestCart.user = userId
                guestCart.guestId = undefined
                await guestCart.save()
                return res.status(200).json(guestCart)
            }
        } else {
            // guest cart has already been merged
            if(userCart){
                return res.status(200).json(userCart)
            }
            res.status(404).json({message: " Guest cart not found"})
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access public
router.post("/", async (req, res) => {
    const { productId, guestId, userId } = req.body
    const quantity = parseInt(req.body.quantity) || 1
    const size = req.body.size?.trim()
    const color = req.body.color?.trim().toLowerCase()

    try {
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({ message: "Product not found" })

        let cart = await getCart(userId, guestId)

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId.toString() &&
                    p.size?.trim() === size &&
                    p.color?.trim().toLowerCase() === color
            )

            if (productIndex > -1) {
                // Product already exists in cart — update quantity
                cart.products[productIndex].quantity += quantity
            } else {
                // Product not in cart — add it
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                })
            }

            // Recalculate total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )

            await cart.save()
            return res.status(200).json(cart)

        } else {
            // Create a new cart
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                }],
                totalPrice: product.price * quantity
            })
            return res.status(201).json(newCart)
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// @route PUT /api/cart
// @desc Update product quantity in the cart
// @access public
router.put("/", async (req, res) => {
    const { productId, guestId, userId, quantity, size, color } = req.body

    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId.toString() &&
                p.size?.trim() === size?.trim() &&
                p.color?.trim().toLowerCase() === color?.trim().toLowerCase()
        )

        if (productIndex > -1) {
            if (quantity <= 0) {
                // Remove product if quantity is 0 or less
                cart.products.splice(productIndex, 1)
            } else {
                cart.products[productIndex].quantity = parseInt(quantity)
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )

            await cart.save()
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access public
router.delete("/", async (req, res) => {
    const { productId, guestId, userId, size, color } = req.body

    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId.toString() &&
                p.size?.trim() === size?.trim() &&
                p.color?.trim().toLowerCase() === color?.trim().toLowerCase()
        )

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1)

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )

            await cart.save()
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// @route GET /api/cart
// @desc Get cart by user id or guest id
// @access public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query

    try {
        const cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found" })
        return res.status(200).json(cart)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})



module.exports = router