require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const cors = require("cors");
app.use(
  cors({
    // origin: 'http://localhost:4200/'
    origin: "*",
    // origin: ['http://localhost:4200/', 'http://localhost:8080/']
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const db = require("./models");
const Role = db.role;
// db.sequelize.sync()
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
require("./routes/result.routes")(app);
require("./routes/patient.routes")(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function initial() {
  Role.create({
    id: 1,
    name: "patient",
  });

  Role.create({
    id: 2,
    name: "medic",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

module.exports = app;
