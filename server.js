const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const session = require('express-session');

// Load environment variables
dotenv.config();

const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to log HTTP requests
app.use(morgan('combined'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport setup
auth(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware to check if the user is authenticated
const isUserAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/auth/google');
}

// Protect docs folder
app.use('/docs/*', isUserAuthenticated);
app.use(express.static(path.join(__dirname, 'public')));

// Google strategy
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email']
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Success authentication
    res.redirect('/docs/');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Run
app.listen(port, () => {
  console.log(`Listening on port ${port} in ${app.get("env")} mode`);
});
