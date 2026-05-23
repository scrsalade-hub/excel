const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:', error.message);
    console.error('\n🔧 To fix this, update your .env file with one of:');
    console.error('   Option 1 - MongoDB Atlas (cloud):');
    console.error('      MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/excel?retryWrites=true&w=majority');
    console.error('   Option 2 - Local MongoDB (install mongodb locally):');
    console.error('      MONGO_URI=mongodb://localhost:27017/excel');
    console.error('   Option 3 - MongoDB Memory Server (for testing):');
    console.error('      npm install mongodb-memory-server');
    console.error('      Then update this file to use MongoMemoryServer\n');
    throw error;
  }
};

module.exports = connectDB;
