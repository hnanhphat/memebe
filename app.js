const express = require("express");
require("dotenv").config();

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const utilsHelper = require("./middleware/utils.helper");
var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/api", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return utilsHelper.sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    "Internal Server Error"
  );
});

module.exports = app;
