// Concierge: routes.js
// Cooper Standard 2022

const express = require('express');

const router = express.Router()
const Recipe = require('../models/recipe');


// Get all recipes
router.get('/all', async (req, res) => {
    try{
        
        const data = await Recipe.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


// Search for recipe by title
router.get('/search', async (req, res) => {
    try{
        const term = req.query.term;
        const data = await Recipe.find({"title" : term});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Post Method
router.post('/post', async (req, res) => {
    const data = new Recipe({
        title: req.body.title,
        description: req.body.description,
        ingredients : req.body.ingredients,
            
    });
        //handle later
       //state ? req.body.state : null,

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
        //console.log(data)

    }
    catch (error) {
        
        res.status(400).json({message: error.message})
    }
})



/* Set */
//Post:
/*
router.post('/addCard/:setName', async (req, res) => {
    const set = await Set.find(req.params.setNamesetName)
    set.push(req.body.id)
})

//Post Method
router.post('/post/card', async (req, res) => {
    const data = new Card({
        title: req.body.title,
        description: req.body.description,
        state : req.body.state,
        focus : req.body.focus
            
    });
        //handle later
       //state ? req.body.state : null,

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
        //console.log(data)

    }
    catch (error) {
        
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Card.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})


//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})
*/
module.exports = router;