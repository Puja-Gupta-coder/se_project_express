const ClothingItem = require("../models/clothingitem");

const createItem = (req, res) => {
  const { name, weather, imageUrl, imageURL } = req.body;
  const url = imageURL || imageUrl;

  // Validate name length
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 30
  ) {
    return res.status(400).send({ message: "Validation error" });
  }

  return ClothingItem.create({ name, weather, imageURL: url })
    .then((item) => {
      const response = item.toObject();
      response.imageUrl = response.imageURL;
      delete response.imageURL;
      res.status(201).send(response);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Validation error", err });
      } else {
        res.status(500).send({ message: "Error from createItem", err });
      }
    });
};

const getItems = (req, res) => {
  return ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      res.status(500).send({ message: "Error from getItems", err })
    );
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { imageURL },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send(item);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Validation error", err });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Invalid item ID", err });
      } else {
        res.status(500).send({ message: "Error from updateItem", err });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send(item);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Invalid item ID", err });
      } else {
        res.status(500).send({ message: "Error from deleteItem", err });
      }
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
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send(item);
      }
    })
    .catch((err) => {
      if (
        err.name === "CastError" ||
        err.message.includes("Cast to ObjectId failed")
      ) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(500).send({ message: "Error from likeItem", err });
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
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send(item);
      }
    })
    .catch((err) => {
      if (
        err.name === "CastError" ||
        err.message.includes("Cast to ObjectId failed")
      ) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(500).send({ message: "Error from dislikeItem", err });
      }
    });

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
