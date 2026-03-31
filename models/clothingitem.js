const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [30, "Name must be no more than 30 characters"],
  },
  weather: {
    type: String,
    required: [true, 'The "weather" field must be filled in'],
    enum: ["hot", "warm", "cold"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // createdAt
  createdAt: { type: Date, default: Date.now },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
