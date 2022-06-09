let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let multer = require("multer");
const http = require("./utils/httpStatus");

// Endpoints
let activityRoutes = require("./route/activity.route");
let announcementRoutes = require("./route/announcement.route");
let categoryRoutes = require("./route/category.route");
let userRoutes = require("./route/user.route");
let questionRoutes = require("./route/question.route");
const { debug } = require("console");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/image", upload.single("file"), (req, res) => {
  return res.send(req.file);
});

app.get("/api/image/:filename", (req, res) => {
  const fileDirectory = __dirname + "/public/uploads/";
  res.sendFile(req.params.filename, { root: fileDirectory }, (err) => {
    res.end();
    if (err) res.status(http.NOT_FOUND);
  });
});

app.use("/api/announcements", announcementRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);

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
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;
