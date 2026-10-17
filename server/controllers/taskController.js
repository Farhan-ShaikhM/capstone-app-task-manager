const Task = require("../models/task");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getTasks = async (req, res, next) => {
  try {
    const { search = "", status = "all", sort = "newest" } = req.query;
    // Use the ObjectId (req.user._id), not the string id: aggregate() below
    // does not auto-convert strings to ObjectIds the way find() does
    const filter = { user: req.user._id };
    const sortOption = ["newest", "oldest", "priority", "title"].includes(sort)
      ? sort
      : "newest";

    if (["pending", "in-progress", "done"].includes(status)) {
      filter.status = status;
    }

    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const totalCountQuery = Task.countDocuments({ user: req.user._id });
    const filteredCountQuery = Task.countDocuments(filter);
    let tasksQuery;

    if (sortOption === "priority") {
      tasksQuery = Task.aggregate([
        { $match: filter },
        {
          $addFields: {
            priorityRank: {
              $switch: {
                branches: [
                  { case: { $eq: ["$priority", "high"] }, then: 0 },
                  { case: { $eq: ["$priority", "medium"] }, then: 1 },
                  { case: { $eq: ["$priority", "low"] }, then: 2 }
                ],
                default: 3
              }
            }
          }
        },
        { $sort: { priorityRank: 1, createdAt: -1 } },
        { $project: { priorityRank: 0 } }
      ]);
    } else {
      const sortBy = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        title: { title: 1, createdAt: -1 }
      }[sortOption];

      tasksQuery = Task.find(filter).sort(sortBy);
    }

    const [tasks, totalCount, filteredCount] = await Promise.all([
      tasksQuery,
      totalCountQuery,
      filteredCountQuery
    ]);

    res.status(200).json({
      success: true,
      count: filteredCount,
      totalCount,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this task"
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const updates = { title, description, status, priority, dueDate };

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",   // return the updated task
      runValidators: true
    });

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this task"
      });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: "Task deleted", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };