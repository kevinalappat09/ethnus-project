// Made by 22BBS0076 - Kevin Alappat

const express = require("express");
const router = express.Router();
const Task = require("../models/Task")

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

// Create a task
router.post("/", isAuthenticated, (req, res) => {
  const { title, description, due_date } = req.body;
  const newTask = new Task({
    title,
    description,
    due_date,
    user: req.user._id
  });
  newTask
    .save()
    .then(task => res.json(task))
    .catch(err => console.log(err));
});

router.get("/", isAuthenticated, (req, res) => {
  Task.find({ user: req.user._id })
    .then(tasks => res.json(tasks))
    .catch(err => console.log(err));
});

router.put("/:id", isAuthenticated, (req, res) => {
  const { title, description, due_date } = req.body;
  Task.findById(req.params.id)
    .then(task => {
      if (!task) return res.status(404).json({ message: "Task not found" });
      if (task.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      task.title = title;
      task.description = description;
      task.due_date = due_date;
      task
        .save()
        .then(task => res.json(task))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: "Task not found" });
      if (task.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      await Task.deleteOne({ _id: req.params.id });
      res.json({ message: "Task deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
