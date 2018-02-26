const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Restaurant = require('../models/restaurant');
const restaurantData = require('./data/restaurants');

//using promises
mongoose.connect('mongodb://localhost/restaurants-database', (err, db) => {
  db.dropDatabase();

  Restaurant.create(restaurantData)
    .then(restaurants => console.log(`${restaurants.length} restaurants created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());

});
