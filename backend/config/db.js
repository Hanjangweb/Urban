const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        }).then((mongoose) => mongoose);
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB Connected to URBAN');
    } catch (error) {
        cached.promise = null;
        console.log('MongoDB Connection Error:', error.message);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDb;