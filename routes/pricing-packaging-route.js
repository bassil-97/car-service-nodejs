const express = require("express");

const pricingPackagesController = require("../controllers/pricing-packages-controller");

const router = express.Router();

router.get("/", pricingPackagesController.getPackagesPrices);

module.exports = router;
