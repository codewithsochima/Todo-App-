const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Welcome to your Todo Application Server!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected succesfully"))
  .catch((err) => console.log("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
