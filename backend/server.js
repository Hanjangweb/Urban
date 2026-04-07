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
app.use(express.json())
app.use(cors())

;

const PORT = process.env.PORT || 3000

//Connect to Mongodb
connectDb();

app.get("/", (req, res) => {
    res.send("Welcome to URBAN")
})

//API route
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



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})