const mongoose = require("mongoose");

async function connectDb(mongoUri) {
  if (!mongoUri) throw new Error("MONGO_URI is required in .env");

  mongoose.set("strictQuery", true);

  // Try real MongoDB first
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log("✅ MongoDB connected:", mongoUri);
    return mongoose.connection;
  } catch (err) {
    console.warn("⚠️  Could not connect to MongoDB at:", mongoUri);
    console.warn("   Falling back to in-memory MongoDB (data resets on restart).");
  }

  // Fallback: in-memory MongoDB
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
    global.__MONGO_MEMORY_SERVER__ = mongod;
    const uri = mongod.getUri() + "smartqueue";
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ In-memory MongoDB started. URI:", uri);
    return mongoose.connection;
  } catch (fallbackErr) {
    throw new Error(
      "Could not start MongoDB (real or in-memory).\n" +
        "Install MongoDB locally: https://www.mongodb.com/try/download/community\n" +
        "Or run: npm install mongodb-memory-server\n" +
        "Original error: " + fallbackErr.message
    );
  }
}

module.exports = { connectDb };
