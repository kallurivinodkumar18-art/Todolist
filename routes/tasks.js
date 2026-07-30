const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all tasks of logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new task
router.post("/", auth, async (req, res) => {
    try {
        const newTask = new Task({
            task: req.body.task,
            user: req.user.id
        });

        await newTask.save();
        res.status(201).json(newTask);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark task as Completed/Pending
router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.completed = req.body.completed;

        await task.save();

        res.json(task);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task Deleted Successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;