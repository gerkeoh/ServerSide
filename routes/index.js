var express = require('express');
var router = express.Router();

// Home route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Batman Workshop' });
});

// Other routes
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Page' });
});

router.get('/help', (req, res) => {
  res.render('help', { title: 'Help Page' });
});

router.get('/report', (req, res) => {
  res.render('report', { title: 'Report Page' });
});

module.exports = router;