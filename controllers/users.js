const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

/**
 * Get all users
 */
const getUsers = (req, res) => {
  UserModel.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" })
    );
};

/**
 * Create a new user
 */
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Basic validation
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 30
  ) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Validation error" });
  }

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Validation error" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      UserModel.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Validation error" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

/**
 * Get current user
 */
const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  UserModel.findById(_id)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

/**
 * Login user
 */
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch(() => {
      res
        .status(UNAUTHORIZED_ERROR_CODE)
        .send({ message: "Incorrect email or password" });
    });
};

/**
 * Update current user
 */
const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  UserModel.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Validation error" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
