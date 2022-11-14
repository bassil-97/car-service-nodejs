const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Gift = require("../models/gift");
const User = require("../models/user");

const getGiftsList = async (req, res, next) => {
  let gifts;
  try {
    gifts = await Gift.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching Order failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    gifts: gifts.map((gift) => gift.toObject({ getters: true })),
  });
};

const redeemGift = async (req, res, next) => {
  let { userId, giftId } = req.body;

  let gift;
  try {
    gift = await Gift.findOne({ _id: giftId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ id: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Couldn't find a user with the provided ID.",
      403
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    existingUser.gifts.push(giftId);
    if (existingUser.points - gift.points <= 0) {
      existingUser.points = 0;
    } else {
      existingUser.points = existingUser.points - gift.points;
    }
    await existingUser.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Storing gift failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ stored: true });
};

exports.getGiftsList = getGiftsList;
exports.redeemGift = redeemGift;
