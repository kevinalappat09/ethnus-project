// Made by 22BBS0069 - Nikita Simlote

const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, is_admin } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ email: "Email already exists" });
    }

    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      is_admin
    });

    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, err => {
      if (err) throw err;
      return res.json(user);
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
