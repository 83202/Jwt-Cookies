//create server
const express = require('express');
const app = express();

//load env file data
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//Midlleware

//Cookie-parser..middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

//import and call the database
require("./config/database").connect();

//route import and mount
const user = require('./routes/user');
app.use('/api/v1', user);

//activation
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})