const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
);

router.post("/login", userController.login);

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUserById);
router.get("/user-gifts/:userId", userController.getUserGifts);

module.exports = router;
