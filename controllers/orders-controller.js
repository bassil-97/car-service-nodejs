const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Order = require("../models/order");
const User = require("../models/user");

const getUserOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching Order failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    orders: orders.map((order) => order.toObject({ getters: true })),
  });
};

const createOrder = async (req, res, next) => {
  const { firstName, lastName, address, date, time, serviceType, userId } =
    req.body;

  const createdOrder = new Order({
    firstName,
    lastName,
    address,
    date,
    time,
    serviceType,
    userId,
  });

  let existingOrder;
  try {
    existingOrder = await Order.findOne({
      time: time,
      date: date,
    });
  } catch (err) {
    const error = new HttpError(
      "Craeting order failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingOrder) {
    const error = new HttpError(
      "Craeting order failed, there is another order at the same time and date.",
      500
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdOrder.save({ session: sess });
    user.orders.push(createdOrder);
    user.points = user.points + 10;
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating order failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ order: createdOrder, booked: true });
};

const deleteOrder = async (req, res, next) => {
  const orderId = req.params.orderId;

  let order;
  try {
    order = await Order.findById(orderId).populate("userId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete order.",
      500
    );
    return next(error);
  }

  if (!order) {
    const error = new HttpError("Could not find order for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await order.remove({ session: sess });
    order.userId.orders.pull(order);
    await order.userId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete order.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "order deleted." });
};

exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.deleteOrder = deleteOrder;
