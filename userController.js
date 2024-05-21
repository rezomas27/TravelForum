const User = require('../models/user');
const bcrypt = require('bcrypt');
const mailChecker = require('mailchecker');
const session = require('express-session');
const { first } = require('lodash');




const user_login_get = (req,res) =>{
    const errorMessage = req.errorMessage; // Replace req.errorMessage with the actual variable containing the error message
    res.render('noaccess/login', { title: 'Signup',errorMessage });
}

const user_login_post = async (req,res)=>{
    const {email,password} = req.body;
    try{
      const user = await User.findOne({Email:email});
      if(!user){
        //user not found
        console.log("No email found");
        res.render('noaccess/login',{title: 'Login',errorMessage:"Email is not registered"});
      }
      //check password
      console.log(password);
      console.log(user.Password);
      const passwordCheck = await bcrypt.compare(password,user.Password);
      console.log(passwordCheck)
      if(!passwordCheck){
        console.log("Wrong password");
        res.render('noaccess/login',{title: 'Login',errorMessage:"Password is incorrect"});
      }else{
        //Login successful
        generateToken(user, 200, res);
        //res.send('Login successful');
        //res.redirect('/posts');
      }
    }catch(err){
      console.log(err);
    }
}

const generateToken = async (user, statusCode, res) => {
  const token = await user.jwtGenerateToken();

  // Parse expiration time from environment variable and convert to milliseconds
  const expireToken = parseInt(process.env.EXPIRE_TOKEN) || 3600; // Default expiry time in seconds

  const options = {
      httpOnly: true,
      expires: new Date(Date.now() + expireToken * 1000) // Convert seconds to milliseconds
  };

  res
      .status(statusCode)
      .cookie('token', token, options)
      .json({ success: true, token })
      //.redirect('/posts');
};


const user_signup_get = (req,res) =>{
    const errorMessage = req.errorMessage; // Replace req.errorMessage with the actual variable containing the error message
    res.render('noaccess/signup', { title: 'Signup',errorMessage });
}

const user_signup_post = async (req,res)=>{
    const {firstName,lastName,Email,Password,confirmPassword} = req.body;
    var validSignup = true;
    //check if email is valid
    const emailValid = mailChecker.isValid(Email);
    if(!emailValid){
      console.log("email is not valid");
      res.render('noaccess/signup',{title: 'Signup',errorMessage:"Email is not valid"});
      validSignup = false;
    }
    //check if email is not already signed up
    const user = await User.findOne({Email});
    if(user){
      //user found
      console.log("Email already in use");
      res.render('noaccess/signup',{title: 'Signup',errorMessage:"Email is already registered. Try a new email"});
      validSignup = false;
    }

    //check if password is valid
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    console.log(Password)
    const passwordValid = passwordPattern.test(Password);
    if(!passwordValid){
        console.log("password is not valid. Must contain at least 1 capital letter, 1 number and be at least 8 characters");
        res.render('noaccess/signup',{title: 'Signup',errorMessage:"Password is not valid. Must contain at least 1 capital letter, 1 number and be at least 8 characters"});
        validSignup= false;
    }
    if(Password != confirmPassword){
        //passwords dont match
      console.log("passwords dont match");
      res.render('noaccess/signup',{title: 'Signup',errorMessage:"Passwords don't match"});
      validSignup = false
      //
    }
    if(validSignup){
      const hashedPassword = await bcrypt.hash(Password,10);
      const user = User({firstName,lastName,Email,Password:hashedPassword});
      user.save()
      .then((result)=>{
        res.redirect('/login');
      })
      .catch((err)=>{
        console.log(err);
      })
    }
}

const user_myAccount_get = (req,res)=>{
  const user = req.session.user;
    if (user) {
        // If user is logged in, render account page with user data
        res.render('access/myAccount', {title:'myAccount', user });
    } else {
        // If user is not logged in, redirect to login page
        res.redirect('/login');
    }
}


module.exports = {
    user_login_get,
    user_login_post,
    user_signup_get,
    user_signup_post,
    user_myAccount_get

}