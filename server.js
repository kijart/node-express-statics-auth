const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet')
const https = require('https');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const serveIndex = require('serve-index');

// Load environment variables
dotenv.config();

const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to secure Express
app.use(helmet());

// Middleware to log HTTP requests
app.use(morgan('combined'));

// Middleware cookie session
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Setup handlebars.js view engine
app.set('view engine', 'hbs');

// Middleware to parse JSON body
app.use(bodyParser.json());

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

// Protect docs directory
app.use('/docs', isUserAuthenticated);
// Serve static files on public directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve directory index on public docs directory
app.use('/docs', serveIndex(path.join(__dirname, 'public/docs'), { 'icons': true }));

// Index
app.get('/', function(req, res) {
  res.render('index', {
    user: req.user
  });
});

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
    const userDomainEmail = req.user.emails[0].value.split('@')[1];
    const allowedDomains = (process.env.ALLOWED_DOMAINS || '').split(',').map(domain => domain.trim())

    if (allowedDomains.indexOf(userDomainEmail) > -1) {
      // Success authentication
      res.redirect('/');
    } else {
      // Unsuccess authentication
      res.redirect('/auth/logout');
    }
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start server
if (
  process.env.SSL_ENABLED === 'true' &&
  process.env.SSL_KEY_PATH &&
  process.env.SSL_CERT_PATH
) {
  // Run server over HTTPS with a SSL certificate
  https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  }, app)
    .listen(port, () => {
      console.log(`Listening on port ${port} in ${app.get("env")} mode over HTTPS`);
    });
} else {
  // Run server over HTTP without a SSL certificate
  app.listen(port, () => {
    console.log(`Listening on port ${port} in ${app.get("env")} mode over HTTP`);
  });
}
