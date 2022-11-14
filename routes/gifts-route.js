const express = require("express");

const giftsController = require("../controllers/giftController");

const router = express.Router();

router.get("/", giftsController.getGiftsList);
router.post("/redeem-gift", giftsController.redeemGift);

module.exports = router;
