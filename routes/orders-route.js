const express = require("express");

const ordersController = require("../controllers/orders-controller");

const router = express.Router();

router.get("/", ordersController.getUserOrders);

router.post("/create-order", ordersController.createOrder);

router.delete("/delete-order/:orderId", ordersController.deleteOrder);

module.exports = router;
