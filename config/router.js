const router = require('express').Router();
const restaurants = require('../controllers/restaurants');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = require('../lib/secureRoute');


router.get('/', (req, res) => res.render('pages/home'));
router.route('/restaurants/new')
  .get(secureRoute, restaurants.new);

router.route('/restaurants')
  .get(restaurants.index)
  .post(secureRoute, restaurants.create);

router.route('/restaurants/:id')
  .get(restaurants.show)
  .put(secureRoute, restaurants.update)
  .delete(secureRoute, restaurants.delete);

router.route('/restaurants/:id/edit')
  .get(secureRoute, restaurants.edit);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/restaurants/:id/comments')
  .post(secureRoute, restaurants.commentsCreate);

router.route('/restaurants/:id/comments/:commentId')
  .delete(secureRoute, restaurants.commentsDelete);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.all('/*', (req, res) => res.render('pages/404'));

module.exports = router;
