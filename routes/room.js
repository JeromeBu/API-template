var express = require("express");
var router = express.Router();

var Room = require("../models/Room.js");
var City = require("../models/City.js");

function getRadians(meters) {
  var km = meters / 1000;
  return km / 111.2;
}

router.get("/around", function(req, res, next) {
  // Latitude et longitude sont obligatoires
  if (!req.query.longitude || !req.query.latitude) {
    return next("Latitude and longitude are mandatory");
  }

  Room.find()
    .where("loc")
    .near({
      center: [req.query.longitude, req.query.latitude],
      maxDistance: getRadians(50000)
    })
    .exec()
    .then(function(rooms) {
      return res.json(rooms);
    })
    .catch(function(err) {
      res.status(400);
      return next(err.message);
    });
});

// Paramètres reçus :
// - req.query.city obligatoire
// - req.query.skip
// - req.query.limit
// - req.query.priceMin
// - req.query.priceMax
router.get("/", function(req, res, next) {
  if (!req.query.city) {
    return next("City is mandatory");
  }

  var filter = {};
  var roomsRes = null;
  var cityRes = null;
  var countRes = null;

  City.findOne({ slug: req.query.city })
    .exec()
    .then(function(city) {
      if (!city) {
        res.status(404);
        return next("City not found");
      }

      cityRes = city;

      filter.city = city._id;
      if (
        req.query.priceMin !== undefined ||
        req.query.priceMax !== undefined
      ) {
        filter.price = {};
        if (req.query.priceMin !== undefined) {
          filter.price["$gte"] = req.query.priceMin;
        }
        if (req.query.priceMax !== undefined) {
          filter.price["$lte"] = req.query.priceMax;
        }
      }

      return Room.find(filter)
        .count()
        .exec();
    })
    .then(function(count) {
      countRes = count;

      var query = Room.find(filter)
        .populate("city")
        .populate({
          path: "user",
          select: "account"
        });
      if (req.query.skip !== undefined) {
        query.skip(parseInt(req.query.skip));
      }
      if (req.query.limit !== undefined) {
        query.limit(parseInt(req.query.limit));
      } else {
        // valeur par défaut de la limite
        query.limit(100);
      }

      return query.exec();
    })
    .then(function(rooms) {
      roomsRes = rooms;

      return res.json({
        rooms: roomsRes || [],
        city: cityRes,
        count: countRes
      });
    })
    .catch(function(err) {
      res.status(400);
      return next(err.message);
    });
});

router.get("/:id", function(req, res, next) {
  Room.findById(req.params.id)
    .populate("city")
    // IMPORTANT SÉCURITÉ
    // Les informations sensibles de l'utilisateur étant stockées à la racine de l'objet, il est important de transmettre uniquement `account`
    .populate({
      path: "user",
      select: "account"
    })
    .exec()
    .then(function(room) {
      if (!room) {
        res.status(404);
        return next("Room not found");
      }

      return res.json(room);
    })
    .catch(function(err) {
      res.status(400);
      return next(err.message);
    });
});

module.exports = router;
