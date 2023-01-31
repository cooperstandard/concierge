// Concierge: routes.js
// Cooper Standard 2022

const express = require('express');

const router = express.Router()
const Recipe = require('../models/recipe');
const User = require('../models/user');

// Section: GET endpoints
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

router.get('/users', async (req, res) => {
    try{
        
        const data = await User.find();
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



// Section: POST endpoints
router.post('/login', async (req, res) => {
    console.log(req.body["user"]);
    res.status(200).json('success')

})


router.post('/recipe', async (req, res) => {
    const data = new Recipe({
        title: req.body.title,
        description: req.body.description,
        ingredients : req.body.ingredients,
        photos : req.body.photos,
        instructions : req.body.instructions,
        allergens : req.body.allergens,
        prepTime : req.body.prepTime    
    });

    try {
        const dataToSave = await data.save();
        console.log("posted " + data.title)
        res.status(200).json(dataToSave);
        //console.log(data)

    }
    catch (error) {
        
        res.status(400).json({message: error.message})
    }
})


//Post Method
router.post('/user', async (req, res) => {
    const data = new User({
        name : req.body.name,
        restrictions : req.body.restrictions,
        email : req.body.mail,
            
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
        //console.log(data)

    }
    catch (error) {
        
        res.status(400).json({message: error.message})
    }
})

// Section: PATCH endpoints




// Section: DELETE endpoints

// Delete all
router.delete('/recipe/all', async (req, res) => {
    try{
        const data = await Recipe.deleteMany({"title" : term});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
    //res.send('Delete by ID API')

})

//delete by name
router.delete('/recipe/search', async (req, res) => {
    try{
        const term = req.query.term;
        const data = await Recipe.deleteMany({"title" : term});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
    //res.send('Delete by ID API')

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