const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnection successful");
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Mongoose disconnected");
  });
  process.exit();
});

module.exports = db;
