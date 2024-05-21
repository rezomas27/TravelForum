const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        // If user is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // If user is not authenticated, redirect to the login page or return an error
        res.redirect('/login'); // or res.status(401).send('Unauthorized');
    }
};

//login routes
router.get('/login',userController.user_login_get);
router.post('/login',userController.user_login_post);
  
  
//signup routes
router.get('/signup',userController.user_signup_get);
router.post('/signup',userController.user_signup_post);

//my account route
router.get('/myAccount',authMiddleware,userController.user_myAccount_get);


module.exports = router;
