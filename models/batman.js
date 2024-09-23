const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batmanSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    cardpin: {
        type: String,
        required: true,
    },
    expirydate: {
        type: Date,
        required: true,
    },
    securitypin: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Batman = mongoose.model('Batman', batmanSchema);
module.exports = Batman;
