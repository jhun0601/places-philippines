const express = require("express");
const validator = require("express-validator");

const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/users/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    validator.check("title").not().isEmpty(),
    validator.check("description").isLength({ min: 5 }),
    validator.check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    validator.check("title").not().isEmpty(),
    validator.check("description").isLength({ min: 5 }),
  ],
  placesControllers.updatePlaceById
);

router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;
