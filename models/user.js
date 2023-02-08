

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    jwt : {
        type : String,
        required : false
    },
    restrictions : {
        type : [String],
        required : false
    },
    email : {
        type : String,
        required : false
    },
    


}, {
    collection : "users"
});

//TODO: add liked recipe storage, array of _id


module.exports = mongoose.model('User', userSchema)