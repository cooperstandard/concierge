// Concierge: routes.js
// Cooper Standard 2023

//TODO: split recipe and user routes to seperate files
//TODO: Description for each endpoint

/* TODO:
 * [ ]: User log in
 * [ ]: Enable Authentications
 * [X]: Patch recipe by title
 * [X]: Patch recipe by id
 * [ ]: Patch user by id
 * [ ]: actual login endpoint
 * 
*/
const express = require('express');
const { findByIdAndUpdate } = require('../models/recipe');
const router = express.Router()
const Recipe = require('../models/recipe');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// PREDEPLOY: this needs to be a private environment variable before we accept actual user data
const conciergeSecret = process.env.conciergeSecret;


function generateAccessToken(username, name) {
    //TODO: enable. token expires after 10 minutes, figure out what the best value for this is
    /*
    const options = {expiresIn: "600s"} 
    return jwt.sign(username, conciergeSecret, options)
    */
    return jwt.sign({userid: 1, email: username}, conciergeSecret)


}


function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.sendStatus(401)
    } 

    jwt.verify(token, conciergeSecret, (err, user) => { 
        // PREDEPLOY: this
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }

        req.user = user

        next()
    })
    
}

function noAuthenticateToken(req,res,next) {
    req.user = "none"
    next()
}

// SECTION: GET endpoints

/* debug generate token 

router.get('/generate', async (req,res) => {
    try {
        const username = req.body.username
        const token = jwt.sign(username, conciergeSecret)

        res.json({token})
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }


})
/*
*/

//tests if the access token is valid
router.get('/authenticate', async (req,res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)

       

        jwt.verify(token, conciergeSecret, (err, user) => {
        //console.log(err)
        // PREDEPLOY: this
        //if (err) return res.sendStatus(403)

            if (err) {
                console.log("token verification failed")
                res.status(500).json({message: "token verification failed"})
            } else {
                res.json({message: "verification successful", email: user})
            }

            

        })
    } catch(error) {
        res.status(405).json({message: error.message})
    }
})

// Get all recipes
router.get('/recipe/all', noAuthenticateToken, async (req, res) => {
    try {
        
        const data = await Recipe.find();
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

//TODO: actual login endpoint
router.get('/user/login', async (req, res) => {
    try {


    } catch (error) {
        res.status(500).json({message: error.message})
    }

    console.log(req.body);
    res.status(200).json({token: generateAccessToken('admin', 'admin')})

})


router.get('/user/all', noAuthenticateToken, async (req, res) => {
    try {
        
        const data = await User.find();
        res.json(data)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get demo
router.get('/recipe/demo', async (req, res) => {
    try {
        const content = [{"allergens":[],"_id":"63d18dab72444738921e3376","title":"Grilled Chicken","description":"Chicken Grilled","ingredients":["Chicken","Salt","Olive Oil"],"photos":[],"__v":0},{"_id":"63d883081e926b7ddb0662a8","title":"spam","description":"a pork product","ingredients":["pork","salt","can"],"allergens":["pork"],"photos":["https://cdn.britannica.com/06/234806-050-49A67E27/SPAM-can.jpg"],"instructions":"Open the can","prepTime":"1 minute","__v":0},{"_id":"63d889c61e926b7ddb0662ca","title":"Fried Rice","description":"Rice fried with onion and egg","ingredients":["rice","vegetable oil","egg","onion","garlic","soy sauce"],"allergens":["egg","onion","soy"],"photos":["https://www.kitchengidget.com/wp-content/uploads/2021/10/Garlic-Fried-Rice-recipe.jpg"],"instructions":"Cook the rice. Tinly slice the onions and garlic. heat oil in a pan on med-high heat. Add Garlic and onion to the pan and fry until slightly browned. crack egg into the pan and scrample, once almost scrambled add rice and soy sauce. Turn heat to high and mix ingredients, fry for another 3 minutes","prepTime":"15 minute","__v":0}]
        res.json(content)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

// Search for recipe by title
router.get('/recipe/search', noAuthenticateToken, async (req, res) => {
    try{
        const term = req.query.term;
        const data = await Recipe.find({"title" : term});
        res.json(data)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})


router.post('/user/login', async (req, res) => {
    let {email, password} = req.body
    let existingUser;

    try {
        existingUser = await User.findOne({email: email})
    } catch {
        const error = new Error("Error! User not found");
        res.status(500).json({message: error.message});
        return
    }
    if (!existingUser || existingUser.password != password) {
        res.status(401).json({message: "Wrong details please check at once"});
        return
    }

    let token;
    try {
        token = jwt.sign(
            {userId : existingUser.id, email: existingUser.email},
            conciergeSecret,
            {expiresIn : "10m"}
        );
    } catch(error) {
        console.log(err);
        error = new Error("Error! Something went wrong.");
        res.status(500).json({message : error.message})
        return
    }

    res
        .status(200)
        .json({
          success: true,
          data: {
              userId: existingUser.id,
              email: existingUser.email,
              token: token,
          },
        });
})


router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    const newUser = User({
        name,
        email,
        password,
    });

    try {
        await newUser.save();
        
    } catch {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            "secretkeyappearshere",
            { expiresIn: "1h" }
        );
    } catch (err) {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
    res
        .status(201)
        .json({
            success: true,
            data: {
                userId: newUser.id,
                email: newUser.email, token: token
            },
        });


})
/*

// Handling post request
app.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = User({
    name,
    email,
    password,
  });
 
  try {
    await newUser.save();
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res
    .status(201)
    .json({
      success: true,
      data: { userId: newUser.id,
          email: newUser.email, token: token },
    });
});
*/

// SECTION: POST endpoints


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

    } catch (error) {
        
        res.status(400).json({message: error.message})
    }
})


//Post Method
/* TODO: save user account
 * [ ]: make sure email is unique, if not send error
 * [ ]: generate token
 * [ ]: save user account
 * [ ]: send back token
*/
/*
router.post('/user', async (req, res) => {
    const data = new User({
        name : req.body.name,
        restrictions : req.body.restrictions,
        email : req.body.email,
        jwt: generateAccessToken(req.body.email)
            
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
        //console.log(data)

    } catch (error) {
        
        res.status(400).json({message: error.message})
    }
})
*/

// SECTION: PATCH endpoints

router.patch('/recipe/title/:title', async (req, res) => {
    try {
        const filter = {title: req.params.title};
        const update = req.body
        //console.log(update)
        const options = {new: true}
        const result =  await Recipe.findOneAndUpdate(filter, update, options)
        console.log(result)
        res.send(result)


    } catch (error) {
        console.log(error.message)
        res.status(400).json({message: error.message})
    }



})

router.patch('/recipe/id/:id', async (req, res) => {
    try {
        
        const update = req.body
        //console.log(update)
        const options = {new: true}
        const result = await Recipe.findByIdAndUpdate(req.params.id, update, options)
        console.log(result)
        res.send(result)


    } catch (error) {
        console.log(error.message)
        res.status(400).json({message: error.message})
    }



})


// SECTION: DELETE endpoints

// Delete all
//TODO: this is intentionally incomplete
router.delete('/recipe/all', async (req, res) => {
    try {
        const data = await Recipe.deleteMany({title: "none"});
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
    //res.send('Delete by ID API')

})

//delete by name
router.delete('/recipe/search', async (req, res) => {
    try {
        const term = req.query.term;
        const data = await Recipe.deleteOne({"title" : term});
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
    //res.send('Delete by ID API')

})


module.exports = router;