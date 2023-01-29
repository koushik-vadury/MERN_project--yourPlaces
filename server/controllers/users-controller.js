const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

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
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Sign up failed, Please try again later", 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let exitingUser;
  try {
    exitingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("loggin in failed, Please try again later", 500));
  }
  if (!exitingUser || exitingUser.password !== password) {
    return next(
      new HttpError(
        "could not identify user, credentials seem to be wrong",
        401
      )
    );
  }
  res.json({
    message: "Logged in!",
    user: exitingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
