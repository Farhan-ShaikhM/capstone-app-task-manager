// Entry point: loads environment variables, connects to MongoDB and starts the server.
// The app itself (middleware + routes) is defined in app.js.
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
