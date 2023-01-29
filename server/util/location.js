const axios = require("axios");
const HttpError = require("../models/http-error");

API_KEY =
  "pk.eyJ1Ijoia291c2hpay12YWR1cmkiLCJhIjoiY2xidDVseTdyMGZlOTNxcW5sZnZicGQ1NiJ9.zQv3f6u8kJYXSfSScZe8yw";

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?limit=4&proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${API_KEY}`
  );

  const data = response.data;

  if (!data) {
    throw new HttpError(
      "Could not find location for the specified address",
      422
    );
  }

  const coordinates = data.features[0].geometry.coordinates;

  const finalCoordinates = {
    lat: coordinates[1],
    lng: coordinates[0],
  };

  return finalCoordinates;
}

module.exports = getCoordsForAddress;
