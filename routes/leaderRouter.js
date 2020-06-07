const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
const Leaders = require('../models/leaders');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        }, err => next(err))
        .catch(err => next(err));
})
.post((req, res, next) => {
    Leaders.create(req.body)
        .then((leader) => {
            res.statusCode = 201;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }, err => next(err))
        .catch(err => next(err));   
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supprted at this endpoint'); 
})
.delete((req, res, next) => {
    Leaders.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        }, err => next(err))
        .catch(err => next(err));
});

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        }, err => next(err))
        .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supprted at this endpoint');
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, 
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
.delete((req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }, err => next(err))
    .catch(err => next(err));; 
});

module.exports = leaderRouter;