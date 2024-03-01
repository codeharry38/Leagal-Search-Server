// Incluede dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require('./routes/index');
const mongoose = require('mongoose');
//const { Client } = require('@elastic/elasticsearch')
const _ = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(_.DB.connection,_.DB.options).then(
  () => {console.log('Database connection is successful') },
  err => { console.log('Error when connecting to the database'+ err)}
);

/*if(process.env.NODE_ENV === 'test') {

} else {           
    mongoose.connect(_.DB.connection,_.DB.options).then(
        () => {console.log('Database connection is successful') },
        err => { console.log('Error when connecting to the database'+ err)}
    );
  }
  */
//Create App
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
// parse application/json
app.use(bodyParser.json())
// CORS
app.use(cors());
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", _.ALLOWD.Origin);
    res.header("Access-Control-Allow-Methods", _.ALLOWD.Methods);
    res.header("Access-Control-Allow-Headers", _.ALLOWD.Headers);
    next();
  });*/
//Configur Routes
app.use('/api', Router);
// Handling Error
app.use((error,req, res, next) =>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
})
console.log('Listening port 5000');
app.listen(5000);

