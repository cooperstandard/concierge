

const mongoose = require("mongoose");

const User = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    restrictions : {
        type : [String],
        required : false
    },
    email : {
        type : String,
        required : false
    }


}, {
    collection : "users"
});

module.exports = mongoose.model('User', userSchema)