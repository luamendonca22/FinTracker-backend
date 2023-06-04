require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const conn = require("./db/conn");
const cors = require("cors");

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use("/cetaceans", express.static("cetaceans"));
//http:localhost//3000/uploads/1680098977109.jpg
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cetaceansRoutes = require("./routes/cetaceansRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const apiRoutes = require("./routes/apiRoutes");

// allow requests
app.use(cors());
// Config JSON response
app.use(express.json());

// Connection with database
conn();

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", cetaceansRoutes);
app.use("/", eventsRoutes);
app.use("/", apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Conection sucessfully");
});
