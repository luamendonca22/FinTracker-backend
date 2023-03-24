require("dotenv").config();
const express = require("express");
const app = express();

const conn = require("./db/conn");
const cors = require("cors");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// allow requests
app.use(cors());
// Config JSON response
app.use(express.json());

// Connection with database
conn();

app.use("/", authRoutes);
app.use("/", userRoutes);

app.listen(3000, function () {
  console.log("Conection sucessfully");
});
