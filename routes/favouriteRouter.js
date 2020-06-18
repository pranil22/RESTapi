const express = require('express');
const favouriteRouter = express.Router();
const bodyParser = require('body-parser');
const Favourite = require('../models/favourite');
const authenticate = require('../authenticate');
const cors = require('./cors');

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourite.find({})
        .populate('user')
        .populate('dishes')
        .then((favourites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(favourites);
        }, (err) => next(err))
        .catch((err) => {
            return next(err);
        })

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user.id })
        .then((favourite) => {
            if(favourite == null) {
                Favourite.create({
                    user: req.user.id
                }).then((favourite) => {
                    for(let dish of req.body) {
                        if(favourite.dishes.indexOf(dish._id) === -1) {
                            favourite.dishes.push(dish._id);
                        }
                    }
                    
                    favourite.save()
                    .then((response) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(response);
                    }, (err) => next(err))
                    .catch((err) => {
                        return next(err);
                    });

                }, (err) => next(err))
                .catch((err) => {
                    return next(err);
                })
            }
            else {
                for(let dish of req.body) {
                    if(favourite.dishes.indexOf(dish._id) === -1) {
                        favourite.dishes.push(dish._id);
                    }
                }
                

                favourite.save()
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => {
                    return next(err);
                });
            }
        }, (err) => next(err))
        .catch((err) => {
            return next(err);
        });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user.id })
        .then((favourite) => {
            if(favourite == null) {
                var err = new Error('User ' + req.user.id + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                Favourite.findOneAndDelete({ user: req.user.id })
                    .then((response) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(response);
                    }, (err) => next(err))
                    .catch((err) => {
                        return next(err);
                    })
            }
        }, (err) => next(err))
        .catch((err) => {
            return next(err);
        });
});


favouriteRouter.route('/:favouriteId')
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user.id })
        .then((favourite) => {
            if(favourite == null) {
                Favourite.create({
                    user: req.user.id
                }).then((favourite) => {
                    console.log(req.params.favouriteId);
                    if(favourite.dishes.indexOf(req.params.favouriteId) === -1) {
                        console.log(favourite.dishes.indexOf(req.params.favouriteId));
                        favourite.dishes.push(req.params.favouriteId);
                    }
                    

                    favourite.save()
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favourite);
                    }, (err) => next(err))
                    .catch((err) => {
                        return next(err);
                    });

                }, (err) => next(err))
                .catch((err) => {
                    return next(err);
                })
            }
            else {
                if(favourite.dishes.indexOf(req.params.favouriteId) === -1) {
                    console.log(favourite.dishes.indexOf(req.params.favouriteId));
                    favourite.dishes.push(req.params.favouriteId);
                }

                favourite.save()
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favourite);
                }, (err) => next(err))
                .catch((err) => {
                    return next(err);
                });
            }
        }, (err) => next(err))
        .catch((err) => {
            return next(err);
        });
      
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user.id })
    .then((favourite) => {
        if(favourite == null) {
            var err = new Error('User ' + req.user.id + ' not found');
            err.status = 404;
            return next(err);
        }
        else if(favourite.dishes.indexOf(req.params.favouriteId) === -1) {
            var err = new Error('Dish ' + req.params.favouriteId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            favourite.dishes.pull(req.params.favouriteId);

            favourite.save()
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favourite);
            }, (err) => next(err))
            .catch((err) => {
                return next(err);
            });
        }
    }, (err) => next(err))
    .catch((err) => {
        return next(err);
    });
});

module.exports = favouriteRouter;