//Require
const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        collection: String
    },
    Age: {
        type: Number,
        required: true,
    },
    Gender: {
        type: String,
        required : true
    },
    Email: {
        type: String,
        required : true
    },
    Password: {
        type: String,
        required : true
    },
    Verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('Users', Users, "Auth_Q");

