

const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
    author : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : false
    }
    


}, {
    collection : "feedback"
});




module.exports = mongoose.model('Feedback', feedbackSchema)