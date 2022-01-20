const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");

router.post(
  "/",

  [
    check("email", "Put a Valid E-mail Please").isEmail(),
    check("password", "The Password Can't be Empty").not().isEmpty(),
  ],
  authControllers.authenticateUser
);

router.get("/", auth, authControllers.userAuht);

module.exports = router;
