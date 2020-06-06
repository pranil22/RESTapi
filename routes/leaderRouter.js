const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send details of all leaders');
})
.post((req, res, next) => {
    res.statusCode = 201;
    res.end(`Will create new leader with name ${ req.body.name } and description ${ req.body.description }`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported at this endpoint');
})
.delete((req, res, next) => {
    res.end('Will delete all leaders');
});

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send leader with id ' + req.params.leaderId);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('This operation is not supported at this endpoint');
})
.put((req, res, next) => {
    res.end(`Will update leader with id ${ req.params.leaderId } with name ${ req.body.name } and description ${ req.body.description }`);
})
.delete((req, res, next) => {
    res.end(`Will deelte the leader with id ${ req.params.leaderId }`);
});

module.exports = leaderRouter;