const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI;
    
    if (!connString) {
      console.error("ERROR: MONGO_URI is undefined. Check your .env file!");
      process.exit(1);
    }

    await mongoose.connect(connString);
    console.log(`MongoDB Connected...`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;