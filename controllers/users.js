const UserModel = require("../models/user");
const {
  BAD_REQUEST_ERROR_CODE,
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
  const { name, avatar } = req.body;

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

  UserModel.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
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

/**
 * Get user by ID
 */
const getUser = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
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

module.exports = { getUsers, createUser, getUser };
