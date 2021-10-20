const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "AIzaSyCh_7bfEIVL6nR9YOQd0GlqK7KyYltw7Xg";

async function getCoordinatesByAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specific address",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordinatesByAddress;
