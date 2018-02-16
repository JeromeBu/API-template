var mongoose = require("mongoose");

var CitySchema = new mongoose.Schema({
  source: String,
  name: String,
  slug: { type: String, unique: true, required: true }, // Le slug est une version "url friendly" du nom de la ville
  loc: {
    type: [Number], // Longitude et latitude
    index: "2d" // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
  },
  zoom: Number
});

module.exports = mongoose.model("City", CitySchema, "cities");
