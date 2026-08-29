const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send("Username is already taken! please try another.");
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.redirect("/auth/login");
  } catch (error) {
    console.log("THE ACTUAL ERROR IS", error);
    res.send("An error occurred during registration. Please try again.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.send("Invalid username or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Invalid username or password.");
    }

    req.session.userId = user._id;

    res.redirect("/dashboard");
  } catch (error) {
    res.send("An error occurred during login.");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out. Please try again.");
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
