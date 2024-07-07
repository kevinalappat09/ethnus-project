// Made by 22BBS0069 - Nikita Simlote
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

require("./models/User");
require("./models/Task");

require("./config/passport")(passport);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const key = process.env.MONGODB_URI;
mongoose
  .connect(key)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
