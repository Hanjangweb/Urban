const express = require("express")
const Order = require("../models/Order")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()

// @route   GET /api/admin/orders
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email")
        res.json(orders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route   PUT /api/admin/orders/:id
// @desc    Update order status
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name")
        if (!order) {
            return res.status(404).json({ message: "Order not found" })  
        }

        order.status      = req.body.status || order.status
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt  // ✅ fixed casing

        const updatedOrder = await order.save()
        res.json(updatedOrder)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
})

// @route   DELETE /api/admin/orders/:id
// @desc    Delete an order
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })  // ✅ early return
        }

        await order.deleteOne()
        res.json({ message: "Order removed successfully" })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router