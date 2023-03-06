

const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    restrictions : {
        type : [String],
        required : false
    },
    oldToken : {
        type : String,
        required : false
    },
    saved : {
        type : [String],
        required: false
    },
    disliked : {
        type : [String],
        required: false
    }
    


}, {
    collection : "users"
});



module.exports = mongoose.model('User', userSchema)