const mongoose = require("mongoose");

const config = require("./config")

const connectDB = async () => {
  try {
    console.log(config.DB_URL)
    await mongoose.connect(config.DB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
