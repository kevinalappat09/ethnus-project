// Made by 22BBS0069 - Nikita Simlote

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const router = express.Router();

const JWT_SECRET = "cat_token";

const isAuthenticated = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, email: user.email, is_admin: user.is_admin };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ user,token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/logout", (req, res) => {

  res.json({ message: "Logged out" });
});

router.get("/getUser", isAuthenticated, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
