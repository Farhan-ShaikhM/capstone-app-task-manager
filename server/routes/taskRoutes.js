const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router
  .route("/")
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;