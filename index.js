// Concierge: index.js
// Cooper Standard 2022


const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes');

mongoose.set('strictQuery', false);
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());

//all endpoints start from /api
app.use('/api', routes)

app.listen(3000, () => {
    console.log(`Server Started on port ${3000}`)
})


