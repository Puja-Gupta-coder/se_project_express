const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

const createToken = (user) =>
  jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET || "super-strong-secret-key",
    {
      expiresIn: "7d",
    }
  );

const signup = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  UserModel.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("User already exists");
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => UserModel.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      const token = createToken(user);
      res.status(201).send({ ...userResponse, token });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
      }

      return bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          throw new UnauthorizedError("Incorrect email or password");
        }

        const token = createToken(user);
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).send({ ...userResponse, token });
      });
    })
    .catch((err) => {
      if (err instanceof UnauthorizedError) {
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = { signup, signin };
