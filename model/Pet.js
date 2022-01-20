const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema({
  animalType: {
    type: String,
    required: true,
    enum: ["Dog", "Cat", "Bird", "Lizard", "Snake", "Rodent","Rabbit"],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  adoptionStatus: {
    type: String,
    required: true,
    enum: ["Adopted", "Fostered", "Available"],
  },
  picture: {
    url: {
      type: String,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
  },
  height: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    require: true,
    trim: true,
  },
  hypoallergenic: {
    type: Boolean,
    default: false,
  },
  dietaryRestrictions: {
    type: String,
    trim: true,
  },
  breed: {
    type: String,
    trim: true,
    require: true,
  },
  
});

module.exports = mongoose.model("Pets", petSchema);
