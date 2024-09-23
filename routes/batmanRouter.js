const express = require('express');
const Batman = require('../models/batman');

const batmanRouter = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

// Route to handle booking creation
batmanRouter.route('/create')
    .get(isAuthenticated, (req, res, next) => {
        res.render('newbatman.ejs', { title: 'Order Batman' });
    })
    .post(isAuthenticated, (req, res, next) => {
        const userId = req.session.userId;
        req.body.userId = userId;

        Batman.create(req.body)
            .then((batmancreated) => {
                res.render('newbatman.ejs', { title: 'Order Batman', batmanDetails: batmancreated });
            })
            .catch((err) => next(err));
    });

batmanRouter.route('/list')
    .get(isAuthenticated, (req, res, next) => {
        const userId = req.session.userId;

        Batman.find({ userId })
            .then((batmansfound) => {
                res.render('currentorder.ejs', { 'batmanlist': batmansfound, title: 'Batmen ordered' });
            })
            .catch((err) => next(err));
    });

// Route to handle deletion of bookings
batmanRouter.route('/delete')
    .get(isAuthenticated, async (req, res, next) => {
        const userId = req.session.userId;

        try {
            // Find all bookings for the logged in user
            const allBookings = await Batman.find({ userId });

            res.render('delete', { title: 'Delete Page', batmanlist: allBookings });
        } catch (err) {
            next(err);
        }
    })
    .post(isAuthenticated, async (req, res, next) => {
        const userId = req.session.userId;
        const bookingId = req.body.bookingId;

        try {
            // Find the booking to be deleted
            const bookingToDelete = await Batman.findOne({ _id: bookingId, userId });

            if (bookingToDelete) {
                // Delete the selected booking
                await Batman.findByIdAndDelete(bookingId);
                res.redirect('/batmans/list');
            } else {
                // Handle the case when the booking is not found
                res.redirect('/batmans/list'); // Redirect to the listing page
            }
        } catch (err) {
            next(err);
        }
    });

    batmanRouter.route('/modify')
    .get(isAuthenticated, async (req, res, next) => {
        const userId = req.session.userId;

        try {
            // Find all bookings for the logged-in user
            const allBookings = await Batman.find({ userId });

            res.render('modify', { title: 'Modify Page', batmanlist: allBookings });
        } catch (err) {
            next(err);
        }
    })
    .post(isAuthenticated, async (req, res, next) => {
        const userId = req.session.userId;
        const bookingId = req.body.bookingId;

        try {
            // Find the booking to be modified
            const bookingToModify = await Batman.findOne({ _id: bookingId, userId });

            if (bookingToModify) {
                // Update the booking details
                bookingToModify.username = req.body[`modifiedName${bookingId}`];
                bookingToModify.date = req.body[`modifiedDate${bookingId}`];
                bookingToModify.time = req.body[`modifiedTime${bookingId}`];

                // Save the modified booking
                await bookingToModify.save();

                // Redirect to the booking list page after modification
                const allBookings = await Batman.find({ userId });
                res.render('currentorder', { title: 'Batmen ordered', batmanlist: allBookings });
            } else {
                // Handle the case when the booking is not found
                res.redirect('/batmans/modify');
            }
        } catch (err) {
            next(err);
        }
    });


module.exports = batmanRouter;
