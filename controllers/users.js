const UserModel = require("../models/user");

// Get all users
const getUsers = (req, res) => {
  return UserModel.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Validate name length
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 30
  ) {
    return res.status(400).send({ message: "Validation error" });
  }

  return UserModel.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) =>
      err.name === "ValidationError"
        ? res.status(400).send({ message: "Validation error" })
        : res.status(500).send({ message: err.message })
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;
  return UserModel.findById(userId)
    .then((user) =>
      !user
        ? res.status(404).send({ message: "User not found" })
        : res.status(200).send(user)
    )
    .catch((err) =>
      err.name === "CastError"
        ? res.status(404).send({ message: "User not found" })
        : res.status(500).send({ message: err.message })
    );
};

module.exports = { getUsers, createUser, getUser };
