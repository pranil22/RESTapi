const express = require('express');
const dishRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
            next(err);
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

dishRouter.route('/:disdId')
.get((req, res, next) => {
    Dishes.findById(req.params.disdId)
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
        req.params.disdId, 
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
    Dishes.findByIdAndRemove(req.params.disdId)
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        }, (err) => next(err))
        .catch((err) => {
            next(err);
        });
});

module.exports = dishRouter;