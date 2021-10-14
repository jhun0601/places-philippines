const express = require("express");
const placesControllers = require("../controllers/places-controller");
const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/users/:uid", placesControllers.getPlaceByUserId);

router.post("/", placesControllers.createPlace);

router.patch("/:pid", placesControllers.updatePlaceById);

router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;