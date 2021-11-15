const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
// error handling routes
app.use((req, res, next) => {
  const error = new HttpError("could not found this route", 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://jhun:jhun@cluster.hniln.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
