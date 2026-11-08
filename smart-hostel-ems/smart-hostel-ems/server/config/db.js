const mongoose = require("mongoose");

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2 && connectionPromise) return connectionPromise;
  connectionPromise = undefined;

  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-hostel-ems";
  connectionPromise = mongoose.connect(uri).then(
    (connection) => {
      console.log("[db] connected");
      return connection;
    },
    (error) => {
      connectionPromise = undefined;
      throw error;
    }
  );
  return connectionPromise;
}

module.exports = connectDB;
