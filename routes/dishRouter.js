const express = require('express');
const dishRouter = express.Router();
const bodyParser = require('body-parser');

const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
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
.post((req, res, next) => {
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
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.delete((req, res, next) => {
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
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
        },(err) => next(err))
        .catch((err) => {
            next(err);
        });
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported at this endpoint');
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
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
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
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
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .exec()
        .then((dish) => {
            if(dish != null) {
                dish.comments.push(req.body);
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
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported on this endpoint');
})
.delete((req, res, next) => {
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
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
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
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported at this endpoint');
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .exec()
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)) {
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }

            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, err => next(err));

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
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .exec()
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, err => next(err));

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