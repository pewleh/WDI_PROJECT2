const User = require('../models/user');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User.create(req.body)
    .then(() => res.redirect('/restaurants'))
    .catch(next);
}

function profileRoute(req, res, next) {
  User.findById(req.params.id)
    .populate('favouriteList')
    .then(user => res.render('registrations/profile', {user}))
    .catch(next);
}

module.exports = {
  new: newRoute,
  create: createRoute,
  profile: profileRoute
};
