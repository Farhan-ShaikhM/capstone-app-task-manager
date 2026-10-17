// Seeds the database with a demo user and sample tasks.
// WARNING: deletes ALL existing users and tasks first.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/user");
const Task = require("./models/task");

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const importData = async () => {
  try {
    await connectDB();

    await Task.deleteMany();
    await User.deleteMany();

    // User.create runs the pre('save') hook, so the password gets hashed
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@example.com",
      password: "demo123"
    });

    await Task.insertMany([
      { title: "Set up project repository", description: "Create client and server folders", status: "done", priority: "high", dueDate: daysFromNow(-2), user: demoUser._id },
      { title: "Build login page", description: "Form with validation and error messages", status: "in-progress", priority: "high", dueDate: daysFromNow(1), user: demoUser._id },
      { title: "Write API tests", description: "Cover auth and task routes with Jest", status: "pending", priority: "medium", dueDate: daysFromNow(3), user: demoUser._id },
      { title: "Update README", description: "", status: "pending", priority: "low", dueDate: daysFromNow(5), user: demoUser._id }
    ]);

    console.log("✅ Seeded demo user (demo@example.com / demo123) with 4 tasks");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

importData();
