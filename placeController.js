const Place = require('../models/user');

const place_search_get = (req,res) =>{
    res.render('access/posts/search', { title: 'Search' });
}

const place_search_post = async (req,res) =>{
    res.render('access/posts/search', { title: 'Search' });
    console.log(req.body);
    console.log("Hello");
}

module.exports = {
    place_search_get,
    place_search_post
}