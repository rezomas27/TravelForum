const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const placeRoutes = require('./routes/placeRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');



//express app
const app = express();



//Connect to mongodb
const dbURI = "mongodb+srv://sammozer:Snickers_27@traveldata.58tvqud.mongodb.net/?retryWrites=true&w=majority&appName=traveldata";
mongoose.connect(dbURI)
  .then(result=>app.listen(3000)) //returns instance of the server)
  .catch((err)=>console.log(err));


//register view engine
app.set('view engine','ejs');


//middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

app.use(session({
  secret:'745287',
  resave:false,
  saveUninitialized: true
}));




//routes

//get usage : 
   //argument 1: path you want to listen to
   //argument 2: function that takes in a request and response object


app.get('/about',(req,res)=>{
    //res.send('<p>about page<p>');
    res.render('noaccess/about',{title:'About'});
});

app.get('/',(req,res)=>{
  res.render('noaccess/index',{title:'Home Page'});
});


app.use('/posts',placeRoutes);

//post routes
app.use('/posts', postRoutes);

//user routes
app.use('/',userRoutes);


//redirects
app.get('/about-us',(req,res)=>{
    res.render('about');
})


//404 page

app.use((req,res)=>{
    res.status(404).render('404');
})

