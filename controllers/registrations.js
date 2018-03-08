const User = require('../models/user');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User.create(req.body)
    .then(user => {
      if(!user || !user.validatePassword(req.body.password)){
        return res.redirect('/login');
      }
      req.session.userId = user._id;

      req.flash('success', `Welcome ${user.username}`);
      res.redirect('/restaurants');
    })
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
