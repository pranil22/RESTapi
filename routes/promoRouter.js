const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
const Promotions = require('../models/promotions');
var auth = require('../authenticate');
const cors = require('./cors');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Promotions.find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promos);
        }, err => next(err))
        .catch(err => next(err));
})
.post(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
        .then((promo) => {
            res.statusCode = 201;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        }, err => next(err))
        .catch(err => next(err));   
})
.put(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supprted at this endpoint'); 
})
.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        }, err => next(err))
        .catch(err => next(err));
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        }, err => next(err))
        .catch(err => next(err));
})
.post(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supprted at this endpoint');
})
.put(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, 
        { $set: req.body },
        { new: true }
        )
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        }, err => next(err))
        .catch(err => next(err));
})
.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }, err => next(err))
    .catch(err => next(err));; 
});

module.exports = promoRouter;