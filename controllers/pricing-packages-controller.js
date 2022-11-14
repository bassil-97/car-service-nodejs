const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Package = require("../models/pricing-packages");

const getPackagesPrices = async (req, res, next) => {
  let packages;

  try {
    packages = await Package.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching packages failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    packages: packages.map((package) => package.toObject({ getters: true })),
  });
};

exports.getPackagesPrices = getPackagesPrices;
