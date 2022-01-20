const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  validatePassword: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  role: {
    type: Boolean,
    default: false,
  },
  adoptedPets: { type: [String], trim: true, },

  savedPets: { type: [String], trim: true },
  
});

module.exports = mongoose.model("Users", userSchema);
