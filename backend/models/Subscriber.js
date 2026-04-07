const mongoose =require("mongoose")

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now()
    },

})

module.exports = mongoose.model("Subscriber", subscriberSchema)