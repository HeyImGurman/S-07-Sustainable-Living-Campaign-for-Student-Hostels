const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-hostel-ems";
  try {
    await mongoose.connect(uri);
    console.log(`[db] connected -> ${uri}`);
  } catch (err) {
    console.error("[db] connection failed:", err.message);
    console.error(
      "[db] Make sure MongoDB is running locally, or set MONGO_URI to an Atlas connection string."
    );
    process.exit(1);
  }
}

module.exports = connectDB;
