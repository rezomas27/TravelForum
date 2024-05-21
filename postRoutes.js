const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

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
router.post('/',authMiddleware, postController.post_create_post);
router.get('/create',authMiddleware, postController.post_create_get);
router.get('/:id',postController.post_details);
router.delete('/:id',postController.post_delete);
router.get('/',postController.post_index);


module.exports = router;