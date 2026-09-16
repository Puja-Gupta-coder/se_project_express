const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");

/**
 * Get all users
 */
const getUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

/**
 * Create a new user
 */
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Basic validation
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 30
  ) {
    return next(new BadRequestError("Validation error"));
  }

  if (!email || !password) {
    return next(new BadRequestError("Validation error"));
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
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation error"));
      }
      return next(err);
    });
};

/**
 * Get current user
 */
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  UserModel.findById(_id)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

/**
 * Login user
 */
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

/**
 * Update current user
 */
const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  UserModel.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation error"));
      }
      return next(err);
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
