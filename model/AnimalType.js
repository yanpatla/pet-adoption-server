const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const animalTypeSchema = new Schema({
  types: {
    type: String,
    trim: true,
    require: true,
  },
});

module.exports = mongoose.model("AnimalType", animalTypeSchema);
