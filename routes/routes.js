// Concierge: routes.js
// Cooper Standard 2023

//TODO: split recipe and user routes to seperate files
//TODO: Description for each endpoint

/* TODO:
 * [X]: User log in
 * [X]: Patch recipe by title
 * [X]: Patch recipe by id
 * [X]: Patch user by email
 * [X]: actual login endpoint
 * [X]: user/like endpoint (like by id)
 * [X]: user/dislike endpoint (dislike by id)
 * [X]: user/getLiked endpoint (get liked recipes)
 * [X]: user/refresh endpoint (refreshes an expired token)
 * [X]: save generated jwt to the users db entry
 * [ ]: tag support in post recipe
 * [X]: get recipe by id 
 * [ ]: get recipes by tag
 * [ ]: enable token expiration
 * [ ]: Enable Authentications
*/
const express = require('express');
const router = express.Router()
const Recipe = require('../models/recipe');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// PREDEPLOY: this needs to be a private environment variable before we accept actual user data
const conciergeSecret = process.env.conciergeSecret;
//console.log(conciergeSecret)



function generateAccessToken(username, name) {
    //TODO: use this
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
        //console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)

        

        jwt.verify(token, conciergeSecret, (err, user) => {
        //console.log(err)
        // PREDEPLOY: this
        //if (err) return res.sendStatus(403)

            if (err) {
                console.log(err)
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
router.get('/recipe/all', async (req, res) => {
    try {
        
        const data = await Recipe.find();
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})


router.get('/recipe/id/:id', async (req, res) => {
    try {
        //console.log(update)
        
        const result = await Recipe.findById(req.params.id)
        console.log(result)
        res.send(result)


    } catch (error) {
        console.log(error.message)
        res.status(400).json({message: error.message})
    }



})



router.get('/user/all', authenticateToken, async (req, res) => {
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

router.get("/user/liked", authenticateToken, async (req, res) => {
    let user;

    try {
        user = await User.findOne({email: req.user.email})

    } catch (error) {
        res.status(500).json({message: "unknown error occured"})
        return
    }

    if(!user) {
        res.status(500).json({message: "failed to find user"})
        return
    }

    res.status(200).json({recipes: user.saved});




})


// SECTION: POST endpoints


router.post('/recipe', async (req, res) => {
    //console.log(req.body)
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

router.post('/user/like', authenticateToken, async (req, res) => {
    let user;
    const recipe = req.body.recipe;

    try {
        //console.log(req.user)
        user = await User.findOne({email: req.user.email})
        //console.log(user)

    } catch (error) {
        res.status(500).json({message: "unknown error occured"})
        return
    }
    if(!user) {
        res.status(500).json({message: "failed to find user"})
        return
    }

    var liked = [...user.saved];
    liked.push(recipe)
    
    try {
        await User.updateOne(
            { "_id": req.user.userId},
            { "$push": { "saved": recipe } },
            {"new" : true}
         );
        
        res.status(200).json({likedRecipes: liked})
    } catch (error) {
        res.status(500).json({message: "failed to update"})
        return
    }

})

router.post('/user/dislike', authenticateToken, async (req, res) => {
    let user;
    const recipe = req.body.recipe;

    try {
        //console.log(req.user)
        user = await User.findOne({email: req.user.email})
        //console.log(user)

    } catch (error) {
        res.status(500).json({message: "unknown error occured"})
        return
    }
    if(!user) {
        res.status(500).json({message: "failed to find user"})
        return
    }

    var liked = [...user.saved]
    liked.splice(liked.indexOf(recipe), 1)

    try {
        await User.updateOne(
            { "_id": req.user.userId},
            { "$set": { "saved": liked }},
            {"new" : true}
         );
        console.log(liked)
        res.status(200).json({likedRecipes: liked})

    } catch (error) {
        res.status(500).json({message: "failed to update"})
        return
    }

    //res.sendStatus(200)



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
            { }//expiresIn : "1h"}
        );
    } catch(error) {
        console.log(error);
        error = new Error("Error! Something went wrong.");
        res.status(500).json({message : error.message})
        return
    }

    await User.findByIdAndUpdate(existingUser.id, {oldToken: token});



    //console.log(token)
    res
        .status(200)
        .json({
          
            userId: existingUser.id,
            email: existingUser.email,
            token: token,
          
        });
})

router.post("/user/refresh", async (req, res) => {
    const {token, email, id} = req.body;
    let user;

    try {
        user = await User.findOne({"email" : email});
    } catch (error) {
        res.status(500).json({message: "unable to refresh token"})
        return
    }
    

    if (!user || token != user.oldToken) {
        res.status(500).json({message: "unable to refresh token, please login"})
        return
    }

    newToken = jwt.sign(
        { userId: id, email: email },
        conciergeSecret,
        { }//expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(id, {oldToken: newToken});
    console.log("updated token")
    res.status(201).json({success: true, token: newToken})
    


    
})


router.post("/user/signup", async (req, res) => {
    const { name, email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({"email" : email});
    } catch (error) {
        res.status(500).json({message: "something whent wrong"})
        return
    }

    if(existingUser) {
        res.status(401).json({message: "user account alread exists with that email"})
        return
    }
    

    var newUser = User({
        name: name,
        email: email,
        password: password,
        oldToken: "",
        restrictions: [],
        saved: []

    });

    try {
        newUser = await newUser.save();
        
    } catch {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            conciergeSecret,
            { }//expiresIn: "1h" }
        );
    } catch (err) {
        const error = new Error("Error! Something went wrong.");
        return error;
    }

    try {
       await User.findByIdAndUpdate(newUser.id, {oldToken: token});
    } catch (error) {
        res.status(500).json({message: error.message})
        return
    }
    


    
    res
        .status(201)
        .json({
            success: true,
            data: {
                userId: newUser.id,
                email: newUser.email, 
                token: token
            },
        });


})

//Post Method

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

router.patch('/recipe/title', async (req, res) => {
    try {
        const filter = {title: req.query.title};
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

router.patch('/user/email/:email', async (req, res) => {
    try {
        
        const update = req.body
        if (update.email != null) {
            new Error("can not update email with this endpoint");
        }
        //console.log(update)
        const options = {new: true}
        const result = await User.findOneAndUpdate({email: req.params.email}, update, options)
        console.log(result)
        res.send(result)


    } catch (error) {
        console.log(error.message)
        res.status(400).json({message: error.message})
    }



})


// SECTION: DELETE endpoints

// Delete all
//TODO: this is intentionally broken
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

router.delete('/user/id', async (req, res) => {
    try {
        const id = req.query.id
        const data = await User.findByIdAndDelete(id)
        res.json(data)
    } catch(error) {
        res.status(500).json({message: error.message})
    }


})


router.delete('/user/email', async (req, res) => {
    try {
        const email = req.query.email
        const data = await User.findOneAndDelete({"email": email})
        if (data) {
            console.log('deleted user with email: %s', data.email)
            res.json(data)
        } else {
            res.json({message: `no users found with email: ${email}`})
        }
        
    } catch(error) {
        res.status(500).json({message: error.message})
    }


})


module.exports = router;