const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordinatesByAddress = require("../util/location");

const Place = require("../models/place");

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError("Could not find place", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, could not find a places ",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(new HttpError("Could not find place of user", 404));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
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
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Banaue-terrace.JPG/240px-Banaue-terrace.JPG",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

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
