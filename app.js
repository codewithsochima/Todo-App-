const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path"); 
require("dotenv").config();
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "my_super_secret_key",
    resave: false,
    saveUninitialized: false,
  }),
);

app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login", { error: null });
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const taskRoutes = require("./routes/tasks");
app.use("/", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
