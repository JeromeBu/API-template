var config = require("../config");
var uid2 = require("uid2");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI, function(err) {
  if (err) console.error("Could not connect to mongodb.");
});

var User = require("../models/User.js");
var City = require("../models/City.js");
var Room = require("../models/Room.js");

var users = require("./users.json");
var cities = require("./cities.json");
var rooms = require("./rooms.json");

// users
for (var i = 0; i < users.length; i++) {
  User.register(
    new User({
      shortId: users[i].id,
      email: users[i].email,
      token: uid2(32),

      account: {
        name: users[i].name,
        description: users[i].description,
        photos: users[i].photos,
        favorites: [],
        rooms: []
      }
    }),
    "password01", // password as second parameter in order to encrypt
    function(err, obj) {
      if (err) {
        console.error(err);
      } else {
        console.log("saved user " + obj.email);
      }
    }
  );
}

// cities
for (var i = 0; i < cities.length; i++) {
  var city = new City({
    source: cities[i].source,
    name: cities[i].name,
    slug: cities[i].id,
    loc: [cities[i].loc.lon, cities[i].loc.lat],
    zoom: cities[i].zoom
  });

  city.save(function(err, obj) {
    if (err) {
      console.log("error saving city : " + city.name);
    } else {
      console.log("saved city : " + obj.name);
    }
  });
}

// rooms
setTimeout(function() {
  console.log("saving rooms...");

  rooms.forEach(function(room_to_save) {
    var data = {
      shortId: room_to_save.id,
      title: room_to_save.title,
      description: room_to_save.description,
      photos: room_to_save.photos,
      price: room_to_save.price,
      ratingValue: room_to_save.ratingValue,
      reviews: room_to_save.reviews,
      loc: [room_to_save.loc.lon, room_to_save.loc.lat],
      // temporary set
      user: room_to_save.userId,
      city: room_to_save.cityId
    };

    User.findOne({ shortId: data.user })
      .exec()
      .then(function(obj) {
        data.user = obj;

        City.findOne({ slug: data.city })
          .exec()
          .then(function(obj) {
            data.city = obj;

            var room = new Room(data);
            room.save(function(err, obj) {
              if (err) {
                console.log("error saving room : " + room.title);
              } else {
                console.log("saved room :" + obj.title);
              }
            });
          })
          .catch(function(err) {
            console.error(err);
          });
      })
      .catch(function(err) {
        console.error(err);
      });
  });
}, 5000);

setTimeout(function() {
  // add favorites
  // users
  users.forEach(function(user) {
    User.findOne({ email: user.email })
      .exec()
      .then(function(userFound) {
        Room.find({ shortId: { $in: user.favoriteIds } })
          .exec()
          .then(function(favorites) {
            favorites.forEach(function(favorite) {
              userFound.account.favorites.push(favorite);
            });
            userFound.save(function(err, obj) {
              if (err) {
                console.error("could not save user : " + userFound.email);
              } else {
                console.log("user favorites updated :" + obj.email);

                Room.find({ shortId: { $in: user.roomIds } })
                  .exec()
                  .then(function(roomsOwned) {
                    roomsOwned.forEach(function(roomOwned) {
                      userFound.account.rooms.push(roomOwned);
                    });
                    userFound.save(function(err, obj) {
                      if (err) {
                        console.error("could not save user " + userFound.email);
                      } else {
                        console.log("user rooms updated " + obj.email);
                      }
                    });
                  })
                  .catch(function(err) {
                    console.error(err);
                  });
              }
            });
          })
          .catch(function(err) {
            console.error(err);
          });
      })
      .catch(function(err) {
        console.error(err);
      });
  });
}, 10000);

setTimeout(function() {
  mongoose.connection.close();
}, 15000);
