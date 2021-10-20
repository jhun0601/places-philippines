const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordinatesByAddress = require("../util/location");

let PLACES = [
  {
    id: "p1",
    title: "Hagdan-hagdan palayan",
    description:
      "The terraces are occasionally called the Eighth Wonder of the World. It is commonly thought that the terraces were built with minimal equipment, largely by hand. ",
    location: {
      lat: 16.9347,
      lng: 121.1354,
    },
    address: "Nueva Vizcaya - Ifugao - Mountain Province Rd, Banaue, Ifugao",
    creator: "1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    // return res.status(404).json({ message: "No record found(s)." });
    // const error = new Error("Could not find place");
    // error.code = 404;
    // throw error;

    throw new HttpError("Could not find place", 404);
  }
  // console.log("GET PLACES ROUTE");
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || PLACES.length === 0) {
    // return res.status(404).json({ message: "No record found(s)." });

    // const error = new Error("Could not find place of user");
    // error.code = 404;
    // return next(error);

    return next(new HttpError("Could not find place of user", 404));
  }
  // console.log("GET PLACES ROUTE");
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("This is a required field", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordinatesByAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("This is a required field", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatePlace = { ...PLACES.find((p) => p.id === placeId) };
  const placeIndex = PLACES.findIndex((p) => p.id === placeId);

  updatePlace.title = title;
  updatePlace.description = description;

  PLACES[placeIndex] = updatePlace;

  res.status(200).json({ place: updatePlace });
};
const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  if (!PLACES.find((p) => p.id === place)) {
    throw new HttpError("Could not find place.", 404);
  }
  PLACES = PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
