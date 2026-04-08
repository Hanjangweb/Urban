const mongoose = require("mongoose");

// This variable persists across function executions in the same "container"
let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  console.log("=> Creating new database connection");
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      // These options help Mongoose handle serverless timeouts better
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected to URBAN");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // On Vercel, don't use process.exit(1), just throw so Vercel can retry
    throw error;
  }
};

module.exports = connectDb;