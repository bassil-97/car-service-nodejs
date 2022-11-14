const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const pricingRoutes = require("./routes/pricing-packaging-route");
const ordersRoutes = require("./routes/orders-route");
const userRoutes = require("./routes/user-routes");
const giftsRoute = require("./routes/gifts-route");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/pricing", pricingRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gifts", giftsRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://bassil97:bassa11223344551997@cluster0.g2dmjmp.mongodb.net/car-washing-db?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
