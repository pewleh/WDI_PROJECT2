const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Restaurant = require('../models/restaurant');
let restaurantData = require('./data/restaurants');
const User = require('../models/user');
const userData = require('./data/user');

//using promises
mongoose.connect('mongodb://localhost/restaurants-database', (err, db) => {
  db.dropDatabase();

  User.create(userData)
    .then(users => {

      console.log(`${users.length} users created`);

      // update the restaurantData to include the correct user IDs
      restaurantData = restaurantData.map(restaurant => {
        restaurant.user = users[0];
        return restaurant;
      });

      // create the restaurants
      return Restaurant.create(restaurantData);

    })
    .then(restaurants => console.log(`${restaurants.length} restaurants created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());

  // Restaurant.create(restaurantData)
  //   .then(restaurants => console.log(`${restaurants.length} restaurants created`))
  //   // .then(() => User.create(userData))
  //   // .then(users => console.log(`${users.length} users created`))
  //   .catch(err => console.log(err))
  //   .finally(() => mongoose.connection.close());

});
