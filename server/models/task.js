const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      default: "",   // optional, matching the frontend form
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending"
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);