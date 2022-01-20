const express = require("express");
const router = express.Router();
const petControllers = require("../controllers/petControllers");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");

router.post(
  "/",
  [
    check("animalType", "Please Put an Animal Type").not().isEmpty(),
    check("name", "Please Put a Name").not().isEmpty(),
    check("adoptionStatus", "Please Put an Adoption Status").not().isEmpty(),
    check("height", "Please Put a Valid Height").notEmpty().isNumeric(),
    check("weight", "Please Put a Valid Weight").notEmpty().isNumeric(),
    check("color", "Please Put a Valid Color").notEmpty().isHexColor(),
    check("bio", "Please Put a Bio")
      .notEmpty()
      .isLength({ min: 6, max: 250 })
      .withMessage(
        "the bio can contain a min of 6 characters and a maximum of 250"
      ),
    check("breed", "Please Put a Valid Breed").notEmpty(),
  ],
  auth,
  petControllers.newPet
);

router.get("/:id", petControllers.getPetsById);

router.put(
  "/:id",
  [
    check("animalType", "Please Put an Animal Type").not().isEmpty(),
    check("name", "Please Put a Name").not().isEmpty(),
    check("adoptionStatus", "Please Put an Adoption Status").not().isEmpty(),
    check("height", "Please Put a Valid Height").notEmpty().isNumeric(),
    check("weight", "Please Put a Valid Weight").notEmpty().isNumeric(),
    check("color", "Please Put a Valid Color").notEmpty().isHexColor(),
    check("bio", "Please Put a Bio")
      .notEmpty()
      .isLength({ min: 6, max: 250 })
      .withMessage(
        "the bio can contain a min of 6 characters and a maximum of 250"
      ),
    check("breed", "Please Put a Valid Breed").notEmpty(),
  ],
  auth,
  petControllers.updatePetById
);

router.get("/", petControllers.getPetsByCriteria);

router.post("/:id/adopt", auth, petControllers.adoptPet);
router.post("/:id/return", auth, petControllers.returnPet);
router
  .post("/:id/save", auth, petControllers.savePet)
  .delete("/:id/save", auth, petControllers.deleteSave)
  .get("/user/:id", auth, petControllers.getPEtsByUserId);

module.exports = router;
