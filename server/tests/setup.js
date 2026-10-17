// Runs before every test file.
// Starts a throwaway in-memory MongoDB so tests never touch a real database.
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRE = "1h";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  // runtimeAdapters works around a MongoDB driver 7.6 bug under Jest
  // (https://github.com/typegoose/mongodb-memory-server/issues/1026)
  await mongoose.connect(mongoServer.getUri(), {
    runtimeAdapters: { os: require("os") }
  });
}, 120000); // first run downloads a MongoDB binary, so allow extra time

// Wipe all data between tests so each test starts from a clean state
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
