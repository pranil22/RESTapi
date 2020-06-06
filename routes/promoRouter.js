const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send details of all promotions');
})
.post((req, res, next) => {
    res.statusCode = 201;
    res.end('Will create new promotion with details => name: ' + req.body.name + ' description : ' + req.body.description);   
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supprted at this endpoint'); 
})
.delete((req, res, next) => {
    res.end('Will delete all the promotions');
});

promoRouter.route('/:promoId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send promotion with id ' + req.params.promoId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supprted at this endpoint');
})
.put((req, res, next) => {
    res.end('Will update the promotion with id ' + req.params.promoId  + ' with details = name: ' + req.body.name + ' description ' + req.body.description);
})
.delete((req, res, next) => {
   res.end('Will delete promotion with id ' + req.params.promoId); 
});

module.exports = promoRouter;