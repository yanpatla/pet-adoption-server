const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");
router
  .post(
    "/",
    [
      check("name", "The Name is Mandatory").not().isEmpty(),
      check("email", "Put a Valid E-mail").isEmail(),
      check("password", "The Passaword Must to Have min 6 char")
        .isLength({ min: 6 })
        .not()
        .isEmpty(),
      check("phoneNumber", "Put a Valid Phone Number").isMobilePhone(),
    ],
    usersControllers.newUser
  )
  .put("/:id", auth, usersControllers.updateUser)
  .get("/", auth, usersControllers.getUser)
  .get("/:id", auth, usersControllers.getUserbyId);

module.exports = router;
    