// Concierge: index.js
// Cooper Standard 2022

//const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
//const http = require('http');
//const https = require('https');
const mongoString = process.env.DATABASE_URL;
//const host = process.env.HOSTNAME;
const routes = require('./routes/routes.js');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');


/*
Certificate is saved at: /etc/letsencrypt/live/concierge.cooperstandard.org/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/concierge.cooperstandard.org/privkey.pem
*/



mongoose.set('strictQuery', false);
mongoose.connect(mongoString);
//console.log(mongoString)
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


// Setting up webserver

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
});

app.use(express.json());

//all endpoints start from /api
app.use('/api', routes)

app.listen(8080, () => {
    console.log(`Server Started on port ${8080}`)
})
/*
if (host != "concierge") {
    // if running on localhost
    app.listen(3000, () => {
        console.log(`Server Started on port ${3000}`)
    })
} else {
    // if running on deploy server
    const port = process.env.PORT;
    const privateKey  = fs.readFileSync('/etc/letsencrypt/live/concierge.cooperstandard.org/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/concierge.cooperstandard.org/fullchain.pem', 'utf8');
    const credentials = {key: privateKey, cert: certificate};

    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port, () => {
        console.log("server starting on port : " + port)
      });

}
*/












