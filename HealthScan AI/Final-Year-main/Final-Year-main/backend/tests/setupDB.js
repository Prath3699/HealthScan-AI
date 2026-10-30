const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Boot an in-memory MongoDB so tests run anywhere, no local mongod needed.
beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri("testdb");
  // Force the app's dbConnect to use the in-memory URI (dotenv does not
  // override already-set variables).
  Object.defineProperty(process.env, "MONGO_URL", {
    value: uri,
    writable: true,
    configurable: true,
    enumerable: true,
  });
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(uri);
  }
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
