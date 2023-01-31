const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const fs = require("fs");
const User = require("../models/user");
const mongoose = require("mongoose");
const getCoordsForAddress = require("../util/location");

/////////////////////////////////////////////////////////////////
const cloudinary = require("cloudinary");
const getDataUri = require("../util/dataUri");
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
///////////////////////////////////////////////////////////////////

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Can't find the place for the provided id", 404));
  }

  if (!place) {
    return next(
      new HttpError("could not find a place for the provided id.", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError("Fetching places failed, Please try again later", 500)
    );
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("could not find a place for the provided userid.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data", 422)
    );
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const fileUri = getDataUri(req.file);
  const fromCloudinary = await cloudinary.v2.uploader.upload(fileUri.content);

  const createPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    creator: req.userData.userId,
    image: fromCloudinary.url,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Creating place failed try again", 500));
  }
  if (!user) {
    return next(new HttpError("Could not find user for provided id", 500));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating place failed try again - 2", 500));
  }
  res.status(201).json({ place: createPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, Could not update place.", 500)
    );
  }
  if (!place || place.length === 0) {
    return next(
      new HttpError("could not find a place for the provided id.", 404)
    );
  }
  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit the place.", 401));
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, Could not update place.", 500)
    );
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HttpError("Something went wrong, Could not delete place", 500)
    );
  }
  if (!place) {
    return next(
      new HttpError("Could not find the place for the provided id", 500)
    );
  }
  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("You are not allowed to delete the place.", 401));
  }

  const publicID = place.image.match(
    /\/image\/upload\/v\d+\/(.*?)\.(jpg|jpeg|png|gif)/i
  )[1];
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, Could not delete place", 500)
    );
  }

  await cloudinary.v2.uploader.destroy(publicID);

  res.status(200).json({ message: "Deleted place." });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
