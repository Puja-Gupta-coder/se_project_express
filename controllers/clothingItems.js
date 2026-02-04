const ClothingItem = require("../models/clothingitem");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Validate name length
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

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) =>
      err.name === "ValidationError"
        ? res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid data" })
        : res
            .status(INTERNAL_SERVER_ERROR_CODE)
            .send({ message: "Error from createItem" })
    );
};
const getItems = (req, res) => {
  return ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from getItems", err })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) =>
      !item
        ? res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" })
        : res.status(200).send(item)
    )
    .catch((err) =>
      err.name === "CastError"
        ? res
            .status(BAD_REQUEST_ERROR_CODE)
            .send({ message: "Invalid item ID", err })
        : res
            .status(INTERNAL_SERVER_ERROR_CODE)
            .send({ message: "Error from deleteItem", err })
    );
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" });
      } else {
        res.status(200).send(item);
      }
    })
    .catch((err) => {
      if (
        err.name === "CastError" ||
        err.message.includes("Cast to ObjectId failed")
      ) {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Item not found" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from likeItem", err });
      }
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" });
      } else {
        res.status(200).send(item);
      }
    })
    .catch((err) => {
      if (
        err.name === "CastError" ||
        err.message.includes("Cast to ObjectId failed")
      ) {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Item not found" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from dislikeItem", err });
      }
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
