const ClothingItem = require("../models/clothingitem");
const {
  BAD_REQUEST_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
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
const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from getItems" })
    );

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { _id } = req.user;

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }

      if (item.owner.toString() !== _id.toString()) {
        return res
          .status(FORBIDDEN_ERROR_CODE)
          .send({ message: "You do not have permission to delete this item" });
      }

      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from deleteItem" });
    });
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
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid item ID" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from likeItem" });
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
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid item ID" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from dislikeItem" });
      }
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
