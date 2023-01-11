// Concierge: recipe.js
// Cooper Standard

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    ingredients: {
        required: false,
        type: [String]
    },
    photos : {
        required: false,
        type: [String]
    },
}, {
    collection : "recipes"
});

module.exports = mongoose.model('Recipe', recipeSchema)
