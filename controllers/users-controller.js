const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
// let USERS = [
//   {
//     id: "1",
//     name: "Jhunmark Ng",
//     email: "ngjhunnen@gmail.com",
//     password: "testtest",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching Users failed. Please try again", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("This is a required field", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    const existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup Failed. Please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exist", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://media-exp1.licdn.com/dms/image/C5603AQERX4Lks3DnTQ/profile-displayphoto-shrink_200_200/0/1619358015036?e=1642636800&v=beta&t=CfOwIVe26Qi5YlBapKHn5f9lHcaUy4H9EzP9dvmUG9Q",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed. Please try again", 500);
    return next(error);
  }

  res.status(200).json({ user: createdUser.toObject({ getters: true }) });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login Failed. Please try again", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid Email/Password", 401);
    return next(error);
  }

  return res.json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
