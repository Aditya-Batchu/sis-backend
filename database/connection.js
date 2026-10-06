const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rgukt_sis', {
      autoIndex: true,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.error(`[MongoDB] Ensure your MongoDB server is running or update MONGODB_URI in .env`);
  }
};

module.exports = connectDB;
