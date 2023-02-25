require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Open Route - Public Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo à nossa API!" });
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.4unhbpa.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conection sucessfully");
  })
  .catch((err) => console.log(err));
