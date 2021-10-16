const { v4: uuidv4 } = require("uuid");

const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

let USERS = [
  {
    id: "1",
    name: "Jhunmark Ng",
    email: "ngjhunnen@gmail.com",
    password: "testtest",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("This is a required field", 422);
  }
  const { name, email, password } = req.body;
  const hasUser = USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("User already exist", 422);
  }
  const createUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  USERS.push(createUser);

  res.status(200).json({ user: createUser });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not find user, Email/Password is invalid", 401);
  }

  return res.json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
