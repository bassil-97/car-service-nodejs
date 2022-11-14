const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const packagesSchema = new Schema({
  type: { type: String, required: true },
  price: { type: String, required: true },
  benifites: [{ type: String, required: true }],
  icon: { type: String, required: true },
});

module.exports = mongoose.model("pricing-packages", packagesSchema);
