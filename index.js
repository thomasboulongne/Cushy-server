var express = require('express');
// var ctf = require('./data/contenful.js');

console.log('Hello its me adele ');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Vous êtes à l\'accueil');
});

app.listen(3637);