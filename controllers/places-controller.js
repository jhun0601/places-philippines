const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const PLACES = [
  {
    id: "p1",
    title: "Banaue",
    description: "hagdan-hagdan palayan",
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    // return res.status(404).json({ message: "No record found(s)." });

    // const error = new Error("Could not find place of user");
    // error.code = 404;
    // return next(error);

    return next(new HttpError("Could not find place of user", 404));
  }
  // console.log("GET PLACES ROUTE");
  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    creator,
  };
  PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatePlace = { ...PLACES.find((p) => p.id === placeId) };
  const placeIndex = PLACES.findIndex((p) => p.id === placeId);

  updatePlace.title = title;
  updatePlace.description = description;

  PLACES[placeIndex] = updatePlace;

  res.status(200).json({ place: updatePlace });
};
const deletePlaceById = (req, res, next) => {};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
