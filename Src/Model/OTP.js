//Require
const mongoose = require('mongoose');

const OTP = new mongoose.Schema({
    UserID:{
        type: String,
        required : true
    },
    OTP:{
        type:String,
        required : true
    },
},{timestamps : true})

module.exports = mongoose.model('OTP',OTP,"OTP");

