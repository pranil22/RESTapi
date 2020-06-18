const express = require('express');
const dishRouter = express.Router();
const bodyParser = require('body-parser');

const Dishes = require('../models/dishes');
var auth = require('../authenticate');
const cors = require('./cors');

dishRouter.use(bodyParser.json());
 
dishRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Dishes.find({})
        .populate('comments.author')
        .then((dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dishes);
        }, (err) => {
            return next(err);
        })
        .catch((err) => {
            next(err);
        });
})
.post(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
        .then((dish) => {
            console.log('Dish created');
            res.statusCode = 201;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
        }, (err) => next(err))
        .catch((err) => {
            next(err);
        });
})
.put(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
        .then((response) => {
            console.log(response);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        }, (err) => next(err))
        .catch((err) => {
            next(err);
        });
});

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .populate('comments.author')
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
        },(err) => next(err))
        .catch((err) => {
            next(err);
        });
})
.post(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported at this endpoint');
})
.put(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(
        req.params.dishId, 
        { $set: req.body } ,
        { new: true }
    ).exec()
    .then((dish) => {
        console.log(dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    });
})
.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
        .exec()
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        }, (err) => next(err))
        .catch((err) => {
            next(err);
        });
});


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .exec()
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish with id ' + req.params.dishId);
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})
.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .exec()
        .then((dish) => {
            if(dish != null) {
                console.log(req.user.__id);
                req.body.author = req.user._id;
                dish.comments.push(req.body);
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish.__id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(dish);
                    })
                }, err => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.statusCode = 404;
                return next(err);
            }
        },(err) => next(err))
        .catch((err) => {
            next(err);
        });
})
.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .exec()
        .then((dish) => {
            if(dish != null) {
                for (let i=(dish.comments.length -1 ); i>=0; i--) {
                    dish.comments.id(dish.comments[i]._id).remove()
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                }, err => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.statusCode = 404;
                return next(err);
            }
        },(err) => next(err))
        .catch((err) => {
            next(err);
        });
});

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .exec()
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported at this endpoint');
})
.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .exec()
    .then((dish) => {
            if(dish && dish.comments.id(req.params.commentId)) {
                var id1 = (req.user.id).toString();
                var id2 = (dish.comments.id(req.params.commentId).author).toString();
    
                if(id1 === id2) {
                    if(req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if(req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
        
                    dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(dish);
                        })
                    }, err => next(err));
                }
                else {
                    var err = new Error("You are not authorized to perform this operation");
                    err.status = 404;
                    return next(err);
                }
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        
        
    }, err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .exec()
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)) {
            var id1 = (req.user.id).toString();
            var id2 = (dish.comments.id(req.params.commentId).author).toString();
  
            if(id1 === id2) {
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                    .then((dish) => {
                        Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(dish);
                    })
                }, err => next(err));
            }
            else {
                var err = new Error("You are not authorized to perform this operation");
                err.status = 404;
                return next(err);
            }
            

        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, err => next(err))
    .catch(err => next(err));
});

module.exports = dishRouter;