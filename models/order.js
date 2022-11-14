const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  serviceType: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Order", orderSchema);
