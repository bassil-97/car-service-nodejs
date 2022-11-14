const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  points: { type: Number, required: false },
  role: { type: String, required: false },
  orders: [{ type: mongoose.Types.ObjectId, required: false, ref: "Order" }],
  gifts: [{ type: mongoose.Types.ObjectId, required: false, ref: "Gift" }],
});

module.exports = mongoose.model("User", userSchema);
