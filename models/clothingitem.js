const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    owner: String,
    createdAt: Date,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [30, "Name must be no more than 30 characters"],
  },
  weather: { type: String, required: true },
  imageUrl: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
