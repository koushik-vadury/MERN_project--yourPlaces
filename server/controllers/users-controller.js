const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/////////////////////////////////////////////////////////////////
const cloudinary = require("cloudinary");
const getDataUri = require("../util/dataUri");
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
///////////////////////////////////////////////////////////////////

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, Please try again later", 500)
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, Please check your data", 422)
    );
  }
  const { name, email, password } = req.body;
  let exitingUser;
  try {
    exitingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, Please try again later", 500)
    );
  }
  if (exitingUser) {
    return next(
      new HttpError("could not create user, email already exits", 422)
    );
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, Please try again", 500));
  }
  ///////////////////////////////////

  const fileUri = getDataUri(req.file);
  const fromCloudinary = await cloudinary.v2.uploader.upload(fileUri.content);

  //////////////////////////////////////////
  const createdUser = new User({
    name,
    email,
    image: fromCloudinary.url,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Sign up failed, Please try again later", 500));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "koushikvadurironok",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Signin up failed, Please try again later", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let exitingUser;
  try {
    exitingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("loggin in failed, Please try again later", 500));
  }
  if (!exitingUser) {
    return next(
      new HttpError(
        "could not identify user, credentials seem to be wrong",
        401
      )
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, exitingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, Please check your credentials and try again",
        500
      )
    );
  }
  if (!isValidPassword) {
    return next(
      new HttpError("Invaild credentials, could not log you in", 401)
    );
  }
  let token;
  try {
    token = jwt.sign(
      { userId: exitingUser.id, email: exitingUser.email },
      "koushikvadurironok",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Login failed, Please try again later", 500));
  }
  res.json({
    userId: exitingUser.id,
    email: exitingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
