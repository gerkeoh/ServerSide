var express = require('express');
var router = express.Router();
const User = require('../models/user');
const loginRouter = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

loginRouter.route('/register')
    .get((req, res, next) => {
        res.render('register.ejs', { title: 'Register' });
    })
    .post(async (req, res, next) => {
        const { username, password } = req.body;

        try {
            // Check if the username is already taken
            const existingUser = await User.findOne({ username });

            if (existingUser) {
                res.render('register.ejs', { title: 'Register', error: 'Username already taken' });
            } else {
                // Create a new user
                const newUser = await User.create({ username, password });
                req.session.userId = newUser._id; // Log in the user immediately after registration
                res.redirect('/batmans/list'); // Redirect to the user's bookings page after successful registration
            }
        } catch (error) {
            next(error);
        }
    });

  loginRouter.route('/logout')
  .get((req, res, next) => {
    // Destroy the user session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Redirect to the login page after logout
      res.redirect('/users/login');
    });
  });

module.exports = router;
module.exports = loginRouter;
