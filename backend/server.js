const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const connectDb = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const subscribeRoutes = require("./routes/subscribeRoutes")
const adminRoutes = require("./routes/adminRoutes")
const productAdminRoutes = require("./routes/productAdminRoutes")
const AdminOrderRoutes = require("./routes/adminOrderRoutes")

const app = express()



app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps) 
        // OR allow any origin by mirroring it back
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}))

app.use(express.json())

const PORT = process.env.PORT || 3000

// MiddleWare to connect DB before every request
app.use(async (req, res, next ) => {
    try{
        await connectDb()
        next()
    }catch(err){
        res.status(500).json({message: "Database connection failed"})
    }
})


app.get("/", (req, res) => {
    res.send("Welcome to URBAN")
})

// API routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api", subscribeRoutes)

// Admin
app.use("/api/admin/users", adminRoutes)
app.use("/api/admin/products", productAdminRoutes)
app.use("/api/admin/orders", AdminOrderRoutes)

// 2. EXPORT FOR VERCEL (Required for Serverless Functions)
module.exports = app; 

// 3. ONLY LISTEN IF NOT ON VERCEL
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}