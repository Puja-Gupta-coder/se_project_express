const ClothingItem = require("../models/clothingitem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  // Validate name length
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 30
  ) {
    return next(new BadRequestError("Validation error"));
  }

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};
const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id } = req.user;

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== _id.toString()) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }

      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.status(200).send(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.send(item);
    })
    .catch((err) => {
      if (
        err.name === "CastError" ||
        err.message.includes("Cast to ObjectId failed")
      ) {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });

const dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      return res.send(item);
    })
    .catch((err) => {
      if (
        err.name === "CastError" ||
        err.message.includes("Cast to ObjectId failed")
      ) {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
