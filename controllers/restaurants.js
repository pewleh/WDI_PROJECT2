const Restaurant = require('../models/restaurant');
const Promise = require('bluebird');

// function indexRoute(req, res) {
//   Restaurant.find()
//     .then(restaurants => res.render('restaurants/index', { restaurants }));
// }
function indexRoute(req, res){
  Promise.props({
    allRestaurants: Restaurant.find().exec(),
    restaurants: Restaurant.find(req.query).exec()
  })
    .then(data => {
      const allCuisines = data.allRestaurants.map(restaurant => restaurant.cuisine);
      const uniqueCuisines = Array.from(new Set(allCuisines)).sort();

      res.render('restaurants/index', {
        restaurants: data.restaurants,
        cuisines: uniqueCuisines,
        selectedCuisine: req.query.cuisine
      });
    });
}


function newRoute(req, res) {
  res.render( 'restaurants/new' );
}

function createRoute(req, res, next) {
  Restaurant.create(req.body)
    .then(() => res.redirect('/restaurants'))
    .catch(next);
}

function showRoute(req,res, next) {
  Restaurant.findById(req.params.id)
    .populate('comments.user')
    .then(restaurant => {
      if(!restaurant) return res.render('pages/404');
      res.render('restaurants/show', { restaurant });
    })
    .catch(next);
}

function editRoute(req,res) {
  Restaurant.findById(req.params.id)
    .then(restaurant => res.render('restaurants/edit', { restaurant }));
}

function updateRoute(req,res) {
  Restaurant.findById(req.params.id)
    .then(restaurant => Object.assign(restaurant, req.body))
    .then(restaurant => restaurant.save())
    .then(() => res.redirect(`/restaurants/${req.params.id}`));
}

function deleteRoute(req,res) {
  Restaurant.findById(req.params.id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/restaurants'));
}

function commentsCreateRoute(req, res, next) {
  req.body.rating = (parseFloat(req.body.food) + parseFloat(req.body.service) + parseFloat(req.body.ambiance)).toFixed(1) / 3;
  req.body.foodRating = ((parseFloat(req.body.food))/3).toFixed(1);
  req.body.serviceRating =((parseFloat(req.body.service))/3).toFixed(1);
  req.body.ambianceRating =((parseFloat(req.body.ambiance))/3).toFixed(1);
  console.log(req.body.rating);
  req.body.user = req.currentUser;
  Restaurant.findById(req.params.id)
    .then(restaurant => {
      restaurant.comments.push(req.body);
      return restaurant.save();
    })
    .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
    .catch(next);
}

function commentsDeleteRoute(req, res, next){
  Restaurant.findById(req.params.id)
    .then(restaurant => {
      const comment = restaurant.comments.id(req.params.commentId);
      comment.remove();
      return restaurant.save();
    })
    .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
    .catch(next);
}

function resFavouriteRoute(req, res, next){
  req.currentUser.favouriteList.push(req.params.id);

  req.currentUser.save()
    .then(() => res.redirect(`/restaurants/${req.params.id}`))
    .catch(next);
}

function deleteFavouriteRoute(req, res, next){

  req.currentUser.favouriteList = req.currentUser.favouriteList.filter(restaurant =>{
    return !restaurant.equals(req.params.id);
  });

  req.currentUser.save()
    .then(() => res.redirect(`/restaurants/${req.params.id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentsCreate: commentsCreateRoute,
  commentsDelete: commentsDeleteRoute,
  resFavourite: resFavouriteRoute,
  deleteFavourite: deleteFavouriteRoute
};

//after phto: res.render('restaurants/index', {restaurants: data.restauant, origins, selectedOrigin: req.query.origin});
//index form

//add.sort too.
