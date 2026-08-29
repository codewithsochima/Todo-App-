const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/auth/login");
}

router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    let query = { user: req.session.userId };

    if (req.query.status === "completed") {
      query.status = "completed";
    } else {
      query.status = "pending";
    }

    const tasks = await Task.find(query);
    res.render("dashboard", {
      tasks,
      currentStatus: req.query.status || "pending",
    });
  } catch (error) {
    console.log("THE ACTUAL DASHBOARD ERROR IS:", error);
    res.send("Error loading dashboard.");
  }
});

router.post("/tasks", isAuthenticated, async (req, res) => {
  try {
    const { title } = req.body;

    const newTask = new Task({
      title,
      user: req.session.userId,
    });

    await newTask.save();
    res.redirect("/dashboard");
  } catch (error) {
    res.send("Error creating task.");
  }
});

router.get('/tasks/:id/complete', isAuthenticated, async (req, res) => {
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { status: 'completed' }
    );
    res.redirect('/dashboard')
  } catch (error) {
    res.send('Error updating task.');
  }
});

router.get('/tasks/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { status: 'deleted' }
    );
    res.redirect('/dashboard')
  } catch (error) {
    res.send('Error deleting task.');
  }
});

module.exports = router;
