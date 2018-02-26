const Restaurant = require('../models/restaurant');

function indexRoute(req, res) {
  Restaurant.find()
    .then(restaurants => res.render('restaurants/index', { restaurants }));
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
      console.log(restaurant);
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

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentsCreate: commentsCreateRoute,
  commentsDelete: commentsDeleteRoute
};
