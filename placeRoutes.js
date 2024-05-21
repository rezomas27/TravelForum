const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController')

const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        // If user is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // If user is not authenticated, redirect to the login page or return an error
        res.redirect('/login'); // or res.status(401).send('Unauthorized');
    }
};


//post routes
router.get('/search',authMiddleware,placeController.place_search_get);
router.post('/search',authMiddleware, placeController.place_search_post);



module.exports = router;