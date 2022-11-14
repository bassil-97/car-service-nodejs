const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const giftSchema = new Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true },
});

module.exports = mongoose.model("Gift", giftSchema);
