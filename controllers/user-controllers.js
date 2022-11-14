const { validationResult } = require("express-validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Gift = require("../models/gift");
const User = require("../models/user");

// Get all users

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ role: "user" }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

// Get user by ID
const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

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

  res.json({ user: user.toObject({ getters: true }) });
};

const getUserGifts = async (req, res, next) => {
  let userId = req.params.userId;

  let user;
  try {
    user = await User.find({ _id: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Couldn't find a user with the provided ID.",
      422
    );
    return next(error);
  }

  let gifts = [];
  for (let i = 0; i < user[0].gifts.length; i++) {
    try {
      let gift = await Gift.findById(user[0].gifts[i]);
      gifts.push(gift);
    } catch (err) {}
  }

  res.json({ gifts: gifts });
};

//Signup user

const signup = async (req, res, next) => {
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }*/

  const { firstName, lastName, phoneNumber, email, password, points } =
    req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exist already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bycrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    firstName,
    lastName,
    phoneNumber,
    email,
    password: hashedPassword,
    points,
    orders: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

// Loing user

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bycrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    firstName: existingUser.firstName,
    points: existingUser.points,
    role: existingUser.role,
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.getUserGifts = getUserGifts;
exports.getUsers = getUsers;
