const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);   // stop the server — no DB means nothing works
  }
};

module.exports = connectDB;

//A few examples of Mongoose queries you can use in your routes or controllers: 

// await Student.find();                          // everything
// await Student.find({ branch: "CSE" });         // filter
// await Student.find({ marks: { $gte: 80 } });   // marks >= 80
// await Student.findById("66b1f4e2a3c8d912...");  // by _id
// await Student.findOne({ email: "diya@college.edu" });  // first match
// await Student.countDocuments({ branch: "CSE" });
// await Student.find().sort({ marks: -1 }).limit(3);     // top 3
// await Student.find().select("name marks");             // only these fields