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
    allergens: {
        type: [String],
        required: false
    },
    photos: {
        required: false,
        type: [String]
    },
    instructions: {
        required: false,
        type: String 
    },
    prepTime: {
        required: false,
        type: String
    },
    tags: {
        required: false,
        type: [String]
    }
}, {
    collection : "recipes"
});

module.exports = mongoose.model('Recipe', recipeSchema)
