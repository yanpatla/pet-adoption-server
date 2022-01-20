const express = require("express");
const router = express.Router();
const animalTypeControllers = require("../controllers/animalTypeControllers");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");

router.get("/", animalTypeControllers.getType).post("/", auth, animalTypeControllers.postType);

module.exports = router;
