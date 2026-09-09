import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

// Fix SRV DNS resolution on Windows networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/engineers_day";

async function testDatabaseConnection() {
  console.log(`Connecting to MongoDB Atlas at: ${MONGO_URI}...`);
  try {
    const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ SUCCESS: Connected to MongoDB Atlas! Host: ${conn.connection.host}`);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Collections found in Atlas 'engineers_day' DB:`, collections.map(c => c.name));

    // Test write and read in 'registrations' collection
    const testSchema = new mongoose.Schema({ name: String, rollNo: String, testTime: Date });
    const TestModel = mongoose.models.TestCheck || mongoose.model("TestCheck", testSchema);

    const created = await TestModel.create({ name: "Atlas Connection Check", rollNo: "000000", testTime: new Date() });
    console.log(`✅ WRITE TEST: Created test record with ID: ${created._id}`);

    const fetched = await TestModel.findById(created._id);
    console.log(`✅ READ TEST: Retrieved test record:`, fetched.name);

    await TestModel.findByIdAndDelete(created._id);
    console.log(`✅ CLEANUP TEST: Removed test check record.`);

    console.log("\n>>> MONGODB ATLAS CLOUD DB IS FULLY WORKING AND READY! <<<\n");
    process.exit(0);
  } catch (error) {
    console.error(`❌ MONGODB CONNECTION FAILED:`, error.message);
    process.exit(1);
  }
}

testDatabaseConnection();
