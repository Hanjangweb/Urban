const express = require("express")
const Order = require("../models/Order")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

// @route GET /api/orders/my-orders
// @desc Get logged in users orders
// @access private
router.get("/my-orders", protect, async (req, res) => {
    try{
        // Find orders for the authenticate users
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(orders)
    }catch(err){
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})


// @route GET /api/orders/:id
// @desc Get order details by id
// @access private
router.get("/:id", protect, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        )
        if(!order){
            return res.status(404).json({message: "Order not found"})
        }
        res.json(order)
    }catch(err){
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})

module.exports = router