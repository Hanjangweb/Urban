const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()

//@route POST /api/users/register
//desc register a new user 
//@access public
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //registration logic
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "User already exists" })
        user = new User({ name, email, password })
        await user.save()

        //create jwt payload
        const payload = { user: { id: user._id, role: user.role } }

        //Sign and return the jwt '
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (error, token) => {
            if (error) throw error
            //Send the user and token in response
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            })
        })
    } catch (err) {
        console.log("Error", err)
        res.status(500).send("Server Error")
    }
})

//@route POST /api/users/login
//desc login user 
//@access publicasync 
router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        //Log logic
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid Credentials" })

        const isMatch = await user.matchPassword(password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" })


        //create jwt payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        }
        //Sign and return the jwt '
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" });
         //Send the user and token in response
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })

    } catch (err) {
        console.error("Error", err)
        res.status(500).send("Server Error")
    }
})

// @route GET /api/users/profile
//@desc Get login user profile (protected route)
//@excess private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user)
})

module.exports = router;