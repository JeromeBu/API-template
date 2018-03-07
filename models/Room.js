var mongoose = require("mongoose");
// Le package `mongoose-simple-random` permet de récupérer aléatoirement des documents dans une collection
var random = require("mongoose-simple-random");

var RoomSchema = new mongoose.Schema({
  shortId: Number,
  title: String,
  description: String,
  photos: [String],
  price: Number,
  ratingValue: Number,
  reviews: Number,
  loc: {
    type: [Number], // Longitude et latitude
    index: "2d" // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  }
});

RoomSchema.plugin(random);

module.exports = mongoose.model("Room", RoomSchema, "rooms");
