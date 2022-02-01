const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Favorites = require('../models/favorite');
const User = require('../models/user')

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => { 
    Favorites.find({}).populate('User').populate('dishes').then((favorites) => {

        if(favorites){
            Favorites.find({auth: req.user._id}).then((favorites) => { 
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
            }).catch((err)=>next(err));
        }else {
            var err = new Error('No favorites here');
            err.status = 404;
            return next(err);
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res ,next) => {

    Favorites.create().then((favorites) => {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
        console.log("favorites Created");
    }, (err) => next(err)).catch((err) => next(err));

})

module.exports = favoriteRouter