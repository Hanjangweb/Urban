const mongoose  = require('mongoose')
const dotenv = require('dotenv')
const Product= require('./models/Product')
const User = require("./models/User")
const Cart = require("./models/Cart")
const products = require("./data/product")

dotenv.config()

// coonnect mongobd
mongoose.connect(process.env.MONGO_URI)

// Function to send data
const seedData = async () => {
    try{
        // Clear existing data
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()
        // create user admin default
        const createUser = await User.create({
            name: "Admin User",
            email: "adminUser@example.com",
            password: "123123",
            role: "admin"
        })
        // asign default user
        const userId = createUser._id
    // Insert the product into the database
    const simpleProducts = products.map((product) => {
        return { ...product, user: userId }
    })
    await Product.insertMany(simpleProducts)
    console.log("Product data seeded successfully")
    process.exit()
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}
seedData()