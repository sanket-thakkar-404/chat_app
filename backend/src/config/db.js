const mongoose = require('mongoose');

async function ConnectToDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
    console.log(`MongoDb connected : ${conn.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // 🔥 app kill karo
  }
}

module.exports = ConnectToDB;