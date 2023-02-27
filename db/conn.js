const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

async function main() {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.4unhbpa.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Conection sucessfully");
  } catch (error) {
    console.log(error);
  }
}

module.exports = main;
