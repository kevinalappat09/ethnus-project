const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

// Load models
require("./models/User");
require("./models/Task");

// Passport config
require("./config/passport")(passport);

const app = express();

// Bodyparser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));

// Connect to MongoDB
require("dotenv").config();
const key = process.env.MONGODB_URI;
mongoose
  .connect(key, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
