const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const { HttpCode } = require("./helpers/constants");
const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, next) => {
  const code = err.status || HttpCode.INTERVAL_SERVER_ERROR;
  const status = err.status ? "error" : "fail";
  res.status(code).json({ status, code, message: err.message });
});

module.exports = app;
