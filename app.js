const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const cookieParser = require("cookie-parser");

const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/category");

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/users", usersRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
