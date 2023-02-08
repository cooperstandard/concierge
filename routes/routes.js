// Concierge: routes.js
// Cooper Standard 2022

//TODO: split recipe and user routes to seperate files
//TODO: Description for each endpoint
const express = require('express');
const { findByIdAndUpdate } = require('../models/recipe');

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

//Get demo
router.get('/demo', async (req, res) => {
    try {
        const content = [{"allergens":[],"_id":"63d18dab72444738921e3376","title":"Grilled Chicken","description":"Chicken Grilled","ingredients":["Chicken","Salt","Olive Oil"],"photos":[],"__v":0},{"_id":"63d883081e926b7ddb0662a8","title":"spam","description":"a pork product","ingredients":["pork","salt","can"],"allergens":["pork"],"photos":["https://cdn.britannica.com/06/234806-050-49A67E27/SPAM-can.jpg"],"instructions":"Open the can","prepTime":"1 minute","__v":0},{"_id":"63d889c61e926b7ddb0662ca","title":"Fried Rice","description":"Rice fried with onion and egg","ingredients":["rice","vegetable oil","egg","onion","garlic","soy sauce"],"allergens":["egg","onion","soy"],"photos":["https://www.kitchengidget.com/wp-content/uploads/2021/10/Garlic-Fried-Rice-recipe.jpg"],"instructions":"Cook the rice. Tinly slice the onions and garlic. heat oil in a pan on med-high heat. Add Garlic and onion to the pan and fry until slightly browned. crack egg into the pan and scrample, once almost scrambled add rice and soy sauce. Turn heat to high and mix ingredients, fry for another 3 minutes","prepTime":"15 minute","__v":0}]
        res.json(content)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})


//TODO: signin

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

router.patch('/recipe/:title', async (req, res) => {
    try {
        const filter = {title: req.params.title};
        const update = req.body
        //console.log(update)
        const options = {new: true}
        const result =  await Recipe.findOneAndUpdate(filter, update, options)
        console.log(result)
        res.send(result)


    }
    catch (error) {
        console.log(error.message)
        res.status(400).json({message: error.message})
    }



})


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