const express = require('express');
const User = require('../models/user');

const loginRouter = express.Router();

loginRouter.route('/login')
    .get((req, res, next) => {
        res.render('login.ejs', { title: 'Login' });
    })
    .post(async (req, res, next) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });

            if (user && user.password === password) {
                req.session.userId = user._id;
                console.log('User logged in. userId:', req.session.userId);
                res.redirect('/batmans/list');
            } else {
                res.render('login.ejs', { title: 'Login', error: 'Invalid username or password' });
            }
        } catch (error) {
            next(error);
        }
    });

module.exports = loginRouter;
