const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const router = require('./config/router');
const session = require('express-session');
const flash = require('express-flash');
const userAuth = require('./lib/userAuth');

// Create our Express app
const app = express();

const PORT = process.env.PORT || 8000;

// connect to our database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/restaurants-database');

// set up our view engine (template engine)
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

//serve static files from the ./public folder
app.use(express.static(`${__dirname}/public`));

//bodyParser BEFORE ROUTER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(req => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


app.use(session({
  secret: 'GysHa^72u91sk0P(',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use(userAuth);

app.use(router);

//set up a global error catcher
app.use((err, req, res, next) => { // eslint-disable-line
  console.log(err);
  if(err.name === 'ValidationError') return res.render('pages/422');
  res.render('pages/500', {err});
});

// Listen for incoming traffic
app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
