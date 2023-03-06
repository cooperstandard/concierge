const mongoose = require("mongoose");


const logSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    event : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : false
    }
    


}, {
    collection : "log"
});




module.exports = mongoose.model('Log', logSchema)